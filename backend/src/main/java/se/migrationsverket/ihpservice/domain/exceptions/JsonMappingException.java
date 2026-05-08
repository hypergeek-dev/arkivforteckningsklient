package se.migrationsverket.ihpservice.domain.exceptions;

public class JsonMappingException extends RuntimeException{
    public JsonMappingException(String message, Throwable cause) { super(message, cause); }
}
