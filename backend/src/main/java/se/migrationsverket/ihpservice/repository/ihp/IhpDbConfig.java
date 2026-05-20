package se.migrationsverket.ihpservice.repository.ihp;

import jakarta.persistence.EntityManagerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.boot.orm.jpa.EntityManagerFactoryBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.sql.DataSource;

@Configuration
@EnableTransactionManagement
@EnableJpaRepositories(entityManagerFactoryRef = "ihpEntityManagerFactory",
        transactionManagerRef = "ihpTransactionManager",
        basePackages = {"se.migrationsverket.ihpservice.repository.ihp"})
public class IhpDbConfig {
    @Primary
    @ConfigurationProperties(prefix = "spring.datasource")
    @Bean
    public DataSource dataSource() {
        return DataSourceBuilder.create().build();
    }

    @Primary
    @Bean(name = "ihpEntityManagerFactory")
    public LocalContainerEntityManagerFactoryBean entityManagerFactory(
            EntityManagerFactoryBuilder builder,
            @Qualifier("dataSource") DataSource dataSource
    ) {
        return builder
                .dataSource(dataSource)
                .packages(
                    "se.migrationsverket.ihpservice.repository.ihp.entities",
                    "se.migrationsverket.ihpservice.domain.visualarkiv"
                )
                .persistenceUnit("ihp")
                .build();
    }

    @Primary
    @Bean(name = "ihpTransactionManager")
    public PlatformTransactionManager ihpTransactionManager(@Qualifier("ihpEntityManagerFactory") EntityManagerFactory ihpEntityManagerFactory) {
        return new JpaTransactionManager(ihpEntityManagerFactory);
    }
}