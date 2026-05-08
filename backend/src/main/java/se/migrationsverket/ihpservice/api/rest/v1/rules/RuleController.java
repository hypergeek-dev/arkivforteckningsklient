package se.migrationsverket.ihpservice.api.rest.v1.rules;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import se.migrationsverket.ihpservice.api.rest.v1.dto.rules.RuleDto;
import se.migrationsverket.ihpservice.api.rest.v1.dto.rules.RuleType;
import se.migrationsverket.ihpservice.domain.services.rules.RuleService;

import java.util.List;
import java.util.concurrent.TimeUnit;

@Slf4j
@AllArgsConstructor
@RestController
@RequestMapping({"/rest/app"})
public class RuleController {
    private final RuleService ruleService;

    private static final String RULES = "rules";

    
    @PostMapping(value = "/rule")
    public RuleDto add(@RequestBody RuleDto rule) {
        return ruleService.add(rule.addMap()).mapToDto();
    }

    
    @PutMapping(value = "/rule")
    public void update(@RequestBody RuleDto rule) {
        ruleService.update(rule.map());
    }

    
    @PatchMapping(value = "/rule/{id}")
    public void establish(@PathVariable Integer id){
        ruleService.establish(id);
    }

    @GetMapping(value = "/rule/{id}")
    public RuleDto get(@PathVariable Integer id){
        return ruleService.fetch(id);
    }

    
    @DeleteMapping(value = "/rule/{id}")
    public void delete(@PathVariable Integer id){
        ruleService.delete(id);
    }

    @GetMapping(value = "/rules")
    public ResponseEntity<List<RuleDto>> fetchAllRules() {
        List<RuleDto> list = ruleService.list();
        log.info("fetchAllRules() -> <200, ok>");
        return ResponseEntity.ok()
                .cacheControl(CacheControl.maxAge(5, TimeUnit.SECONDS))
                .eTag(RULES + list.hashCode())
                .body(list);
    }

    @GetMapping(value = "/rules/filter/{ruleType}")
    public ResponseEntity<List<RuleDto>> fetchAllByType(@PathVariable RuleType ruleType){
        List<RuleDto> list = ruleService.list(ruleType);
        return ResponseEntity.ok()
                .cacheControl(CacheControl.maxAge(5, TimeUnit.SECONDS))
                .eTag(RULES + list.hashCode())
                .body(list);
    }

    @GetMapping(value = "/rules/filter/DEFAULT_RULE/ranges")
    public ResponseEntity<List<RuleDto>> fetchAllByFilter(@RequestParam List<List<Integer>> value){
        List<RuleDto> list = ruleService.list(value);
        log.info("fetchAllByFilter() -> <200, ok>");
        return ResponseEntity.ok()
                .cacheControl(CacheControl.maxAge(5, TimeUnit.SECONDS))
                .eTag(RULES + list.hashCode())
                .body(list);
    }
}