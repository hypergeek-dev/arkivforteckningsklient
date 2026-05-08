package se.migrationsverket.ihpservice.api.rest.v1;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import se.migrationsverket.ihpservice.api.rest.v1.dto.*;
import se.migrationsverket.ihpservice.domain.ModelSnapshotEstablished;
import se.migrationsverket.ihpservice.domain.services.BulkUpdateService;
import se.migrationsverket.ihpservice.domain.services.HistoryService;
import se.migrationsverket.ihpservice.domain.services.ModelSnapshotEstablishedService;
import se.migrationsverket.ihpservice.domain.services.snap.StructureSnapService;
import se.migrationsverket.ihpservice.support.audit.RequestContextHolder;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

import static se.migrationsverket.ihpservice.support.ApplicationStatics.CORRELATION_ID;


@Slf4j
@RestController
@AllArgsConstructor
@RequestMapping({"/rest/app"})
public class ModelController {
    private final StructureSnapService structureSnapService;
    private final ModelSnapshotEstablishedService establishedSnapService;
    private final BulkUpdateService bulkUpdateService;
    private final HistoryService historyService;
    RequestContextHolder reqContextHolder;

    @GetMapping(value = "/snap/{id}/workdto")
    public ResponseEntity<List<String>> getWorkDto(@PathVariable String id) {
        return ResponseEntity
                .ok()
                .body(structureSnapService.getWorkDTO(Integer.parseInt(id)));
    }

    @GetMapping(value = "/snap/established/active")
    public ResponseEntity<ModelSnapshotEstablishedDto> getActiveEstablishedSnap() {
        Optional<ModelSnapshotEstablished> establishedSnap = establishedSnapService.getActiveIHP();
        log.info("getActiveEstablishedSnap() -> <200, ok>");
        return establishedSnap.map(modelSnapshot -> ResponseEntity.ok()
                        .cacheControl(CacheControl.maxAge(5, TimeUnit.SECONDS))
                        .eTag("" + establishedSnap.hashCode())
                        .body(modelSnapshot.mapToDto()))
                .orElseGet(() -> ResponseEntity.ok().build());
    }

    @GetMapping(value = "/snap/{ts}/{id}/established")
    public ResponseEntity<ModelSnapshotEstablishedDto> getSnapshotEstablishedByIdDate(@PathVariable Timestamp ts, @PathVariable String id) {
        Optional<ModelSnapshotEstablished> optSnap = establishedSnapService.fetchByTimestamp(ts, Integer.parseInt(id));
        return optSnap.map(modelSnapshot -> ResponseEntity.ok().body(modelSnapshot.mapToDto()))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    

    @PatchMapping(value = "/bulkupdate/approve")
    public void approveBulk(@RequestBody List<BulkStatusChangeNodeDto> nodesToApprove, @RequestHeader(CORRELATION_ID) String correlationId) {
        bulkUpdateService.batchUpdateStatus(nodesToApprove, NodeStatus.GODKAND, correlationId);
    }

    @PatchMapping(value = "/bulkupdate/draft")
    public void draftBulk(@RequestBody BulkStatusChangeToDraftDto draftNodesAndComment, @RequestHeader(CORRELATION_ID) String correlationId) {
        bulkUpdateService.batchUpdateStatusToDraft(draftNodesAndComment, correlationId);
    }


    @PatchMapping(value = "/bulkupdate/ready")
    public void readyBulk(@RequestBody List<BulkStatusChangeNodeDto> nodesToApprove, @RequestHeader(CORRELATION_ID) String correlationId) {
        bulkUpdateService.batchUpdateStatus(nodesToApprove, NodeStatus.KLAR, correlationId);
    }


    
    @PatchMapping(value = "/bulkupdate/establish")
    public void establishBulk(@RequestBody List<BulkStatusChangeNodeDto> nodesToApprove, @RequestHeader(CORRELATION_ID) String correlationId) {
        bulkUpdateService.batchUpdateStatus(nodesToApprove, NodeStatus.FASTSTALLD, correlationId);
    }

    @GetMapping(value = "/history/{uuid}")
    public ResponseEntity<List<HistoryDto>> getHistory(@PathVariable UUID uuid) {
        return ResponseEntity
                .ok()
                .cacheControl(CacheControl.maxAge(30, TimeUnit.SECONDS))
                .eTag("v-" + uuid) // lastModified is also available
                .body(historyService.getHistoryByUuid(uuid));

    }
}
