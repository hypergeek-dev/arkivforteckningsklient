package se.migrationsverket.ihpservice.domain.config;

import io.micrometer.core.aop.TimedAspect;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@ComponentScan("se.migrationsverket.ihpservice")
public class MetricsConfig {
    @Bean
    public TimedAspect timedAspect(MeterRegistry registry){
        return new TimedAspect(registry);
    }
}
