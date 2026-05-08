package se.migrationsverket.ihpservice.support.security;

/**
 * Created by EFREMR on 2018-03-26.
 */
public interface SecurityHelper {


    boolean isAllowed(String action, IhpAuthResources ihpAuthResources);

}