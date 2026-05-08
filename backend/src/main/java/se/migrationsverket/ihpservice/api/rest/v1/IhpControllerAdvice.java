/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package se.migrationsverket.ihpservice.api.rest.v1;

import jakarta.ws.rs.NotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import se.migrationsverket.ihpservice.domain.exceptions.AuthorizationException;
import se.migrationsverket.ihpservice.domain.exceptions.PreconditionFailedException;

/**
 * @author JESOHN
 */
@Order(Ordered.HIGHEST_PRECEDENCE)
@ControllerAdvice
@Slf4j
public class IhpControllerAdvice {
    private static final String CAUSE = "\nCause: ";

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ResponseBody
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<?> handleMethodArgumentTypeMismatchException(MethodArgumentTypeMismatchException ex) {
        log.warn("{} {}", ex.getMessage(), CAUSE, ex.getCause());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).contentType(MediaType.TEXT_PLAIN).body(ex.getMessage());
    }

    @ResponseStatus(HttpStatus.PRECONDITION_FAILED)
    @ResponseBody
    @ExceptionHandler(PreconditionFailedException.class)
    public ResponseEntity<?> handlePreconditionFailedException(PreconditionFailedException ex) {
        log.warn("{} {}", ex.getMessage(), CAUSE, ex.getCause());

        return ResponseEntity.status(HttpStatus.PRECONDITION_FAILED).contentType(MediaType.TEXT_PLAIN).body(ex.getMessage());
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ResponseBody
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<?> handleIllegalArgumentException(IllegalArgumentException ex) {
        log.warn("{} {}", ex.getMessage(), CAUSE, ex.getCause());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).contentType(MediaType.TEXT_PLAIN).body(ex.getMessage());
    }

    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    @ResponseBody
    @ExceptionHandler(AuthorizationException.class)
    public ResponseEntity<?> handleAuthorizationException(AuthorizationException ex) {
        log.warn("{}", ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).contentType(MediaType.TEXT_PLAIN).body(ex.getMessage());
    }

    @ResponseStatus(HttpStatus.NOT_FOUND)
    @ResponseBody
    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<?> handleNotFoundException(NotFoundException ex) {
        log.warn(ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.NOT_FOUND).contentType(MediaType.TEXT_PLAIN).body(ex.getMessage());
    }

    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ResponseBody
    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleException(Exception ex) {
        log.warn(ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).contentType(MediaType.TEXT_PLAIN).body(ex.getMessage());
    }


}
