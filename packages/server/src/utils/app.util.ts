import { AppData } from '@/modules/app/types/app-core.type';

/**
 * If the hit is a test user, replace the app's resources with the test version
 */
export function parserApp(app: AppData, userId: string): AppData {
  if (app.testUsers.includes(userId) && app.testVersion && app.testResources) {
    const { testVersion, testResources, testConfig, testVersionCreateAt } = app;
    return {
      ...app,
      isTest: true,
      version: testVersion,
      resources: testResources,
      config: testConfig,
      versionCreateAt: testVersionCreateAt,
    };
  }

  return app;
}
