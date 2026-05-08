package se.migrationsverket.ihpservice.domain;

import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;
import se.migrationsverket.ihpservice.repository.ihp.EventLoggRepository;

@Component
@Slf4j
public class EventLoggListener implements ApplicationListener<IhpEventLoggEvent> {

    private final EventLoggRepository eventLoggRepository;


    public EventLoggListener(EventLoggRepository eventLoggRepository) {
        this.eventLoggRepository = eventLoggRepository;
    }

    @Override
    public void onApplicationEvent(@NotNull IhpEventLoggEvent event) {
        eventLoggRepository.addEventLogg(event);
    }

}
