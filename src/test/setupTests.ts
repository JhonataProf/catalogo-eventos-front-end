import "@testing-library/jest-dom";
import { beforeEach } from "vitest";

import { clearSessionFetchCache } from "@/domains/public-portal/cache/sessionFetchCache";

beforeEach(() => {
  clearSessionFetchCache();
});