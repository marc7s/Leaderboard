import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestModuleMetadata } from '@angular/core/testing';
import { AppModule } from '../app.module';

/**
 * TestBed setup that makes every component, pipe and module of the app available,
 * and replaces the HTTP backend with a fake one so tests never call the real API.
 * Use HttpTestingController to inspect or answer requests in a test.
 */
export const appTestingModule: TestModuleMetadata = {
  imports: [AppModule],
  providers: [provideHttpClientTesting()],
};
