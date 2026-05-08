package se.migrationsverket.ihpservice.api.rest.v1;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import se.migrationsverket.ihpservice.api.rest.v1.dto.elements.ElementDataTypeDto;
import se.migrationsverket.ihpservice.api.rest.v1.dto.elements.ElementDto;
import se.migrationsverket.ihpservice.domain.services.elements.ElementService;

import java.util.List;

@Slf4j
@AllArgsConstructor
@RestController
@RequestMapping({"/rest/app"})
public class ElementsController {

    ElementService elementService;

    @PostMapping(value = "/element")
    public ElementDto add(@RequestBody ElementDto elm) {
        return elementService.add(elm.addMap());
    }


    @GetMapping(value = "/element/issue/{id}/id")
    public List<ElementDto> getConnectedElementsForIssue(@PathVariable Integer id) {
        return elementService.getConnectedElementsForIssue(id);
    }

    @GetMapping(value = "/element/document/{id}/id")
    public List<ElementDto> getConnectedElementsForDocument(@PathVariable Integer id) {
        return elementService.getConnectedElementsForDocument(id);
    }

    @PutMapping(value = "/element")
    public void update(@RequestBody ElementDto elm) {
        elementService.update(elm.map());
    }

    
    @PatchMapping(value = "/element/{id}")
    public void establish(@PathVariable Integer id) {
        elementService.establish(id);
    }

    @GetMapping(value = "/element/{id}")
    public ElementDto get(@PathVariable Integer id) {
        return elementService.fetch(id);
    }

    @GetMapping(value = "/element/datatypes")
    public List<ElementDataTypeDto> getDataTypes() {
        return elementService.getDataTypes();
    }

    @DeleteMapping(value = "/element/{id}")
    public void delete(@PathVariable Integer id) {
        elementService.delete(id);
    }

    @GetMapping(value = "/elements")
    public List<ElementDto> fetchAll() {
        return elementService.list();
    }

}
