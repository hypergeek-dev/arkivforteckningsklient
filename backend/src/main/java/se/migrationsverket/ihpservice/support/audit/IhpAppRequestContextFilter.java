package se.migrationsverket.ihpservice.support.audit;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import se.migrationsverket.ihpservice.support.ApplicationStatics;

import java.io.IOException;
import java.util.Arrays;
import java.util.Enumeration;
import java.util.List;

@Slf4j
@Component
public class IhpAppRequestContextFilter extends OncePerRequestFilter {
    private final RequestContextHolder requestContextHolder;

    @Autowired
    public IhpAppRequestContextFilter(
            RequestContextHolder requestContextHolder) {
        this.requestContextHolder = requestContextHolder;
    }

    @Override
    protected void doFilterInternal(@NotNull HttpServletRequest request, @NotNull HttpServletResponse response, @NotNull FilterChain filterChain)
            throws ServletException, IOException {
        String consumer;
        String correlationId;
        String correlationid;
        String auth;

        List<String> whiteList = Arrays.asList("pdf/", "/static", "/info", "/health", "/error", "/rest/v1/", "swagger", "/ping", "api-docs", "favicon.ico", "manifest.json", "eventlog", "/actuator", "/liveness", "/ihpappbackend/v3/", "/v3/", "/ihpappbackend/rest/v1/");
        boolean inWhiteList = whiteList.stream().anyMatch(wl -> request.getRequestURI().contains(wl));
        if (!inWhiteList && !"/".equals(request.getRequestURI())) {
            try {
                consumer = request.getHeaders(ApplicationStatics.CONSUMER).nextElement();
                correlationId = request.getHeaders(ApplicationStatics.CORRELATION_ID).nextElement();
                correlationid = request.getHeaders(ApplicationStatics.MDC_CORRELATION_ID).nextElement();
                auth = resolveAuth(request, consumer);
            } catch (Exception e) {
                log.info("Required headers missing");
                logHeaders(request);
                throw new IllegalArgumentException("Required headers missing");
            }
            requestContextHolder.put(ApplicationStatics.CONSUMER, consumer);
            requestContextHolder.put(ApplicationStatics.CORRELATION_ID, correlationId);
            requestContextHolder.put(ApplicationStatics.MDC_CORRELATION_ID, correlationid);
            requestContextHolder.put(ApplicationStatics.AUTH, auth);
            requestContextHolder.put(ApplicationStatics.REMOTE_ADDR, request.getRemoteAddr());
            MDC.put(ApplicationStatics.MDC_CORRELATION_ID, correlationId);
            MDC.put(ApplicationStatics.CONSUMER, consumer);
        }
        filterChain.doFilter(request, response);
    }

    private void logHeaders(HttpServletRequest request) {
        Enumeration<String> headerNames = request.getHeaderNames();
        if (request.getHeaderNames() != null) {
            while (headerNames.hasMoreElements()) {
                String headerName = headerNames.nextElement();
                log.info("Header: name: {} value: {}", headerName, request.getHeader(headerName));
            }
        }
    }

    private String resolveAuth(HttpServletRequest request, String consumer) {
        String auth;
        try {
            auth = request.getHeaders(ApplicationStatics.AUTH).nextElement();
        } catch (RuntimeException ex) {
            logger.warn(String.format("Rest request without auth header recieved. URI:%s Consumer:%s", request.getRequestURI(), consumer));
            auth = "unknown";
        }
        return auth;
    }

}