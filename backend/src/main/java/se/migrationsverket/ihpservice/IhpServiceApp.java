package se.migrationsverket.ihpservice;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.Executor;

@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})
@EnableAsync
@Slf4j
@EnableScheduling
@EnableAspectJAutoProxy
public class IhpServiceApp {
    public static void main(String[] args) {
        SpringApplication.run(IhpServiceApp.class, args);
    }

    @Bean
    public Executor taskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setRejectedExecutionHandler((runnable, threadPoolExecutor) ->
                log.error("Rejected statistics event executor, this is really bad for the statistics :.( Analyze and restart service...")
        );
        executor.setCorePoolSize(1);
        executor.setMaxPoolSize(1);
        executor.setThreadNamePrefix("Evaluation-");
        executor.initialize();
        return executor;
    }
}