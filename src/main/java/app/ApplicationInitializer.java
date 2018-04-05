package app;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.ServletRegistration;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.web.WebApplicationInitializer;
import org.springframework.web.context.support.AnnotationConfigWebApplicationContext;
import org.springframework.web.servlet.DispatcherServlet;

import app.config.WebMvcConfig;


@Configuration
@PropertySource("classpath:/application.properties")
public class ApplicationInitializer implements WebApplicationInitializer {

	
	@Override
	public void onStartup(ServletContext container) throws ServletException {
		
		AnnotationConfigWebApplicationContext context = new AnnotationConfigWebApplicationContext();
		
		context.register(WebMvcConfig.class);
		
		DispatcherServlet servlet = new DispatcherServlet(context);
		ServletRegistration.Dynamic dispatcher = container.addServlet("dispatcher", servlet);
		
		dispatcher.setLoadOnStartup(1);
		dispatcher.addMapping("/");
	}
}
