import type { DataModelDelivery } from '@/model/data-model-delivery';
import type { SoftwareSystemRepo } from '@/model/software-system-repo';

export type DeliveryRole = 'storage' | 'express' | 'web' | 'dispatcher' | 'dispatcher-web' | 'gateway';

/** One file Code Control writes into a repo. */
export type RenderedFile = {
  role: DeliveryRole;
  path: string;
  content: string;
  action: 'create' | 'update';
};

/** A convention check result for a rendered file. */
export type RenderFinding = {
  severity: 'error' | 'warning';
  role: DeliveryRole;
  path: string;
  message: string;
  convention_key: string;
};

/** One role's target repo and its delivery for a proposal (either may be missing). */
export type DeliveryTarget = {
  role: DeliveryRole;
  repo: SoftwareSystemRepo | null;
  delivery: DataModelDelivery | null;
};

/** GET /api/data/data-model-deliveries/preview */
export type DeliveryPreview = {
  role: DeliveryRole;
  repo_full_name: string;
  base_branch: string;
  files: RenderedFile[];
  findings: RenderFinding[];
};

/** GET /api/data/data-model-deliveries/screenshot: the template's preview page as a PNG (2x). */
export type DeliveryScreenshot = {
  role: DeliveryRole;
  repo_full_name: string;
  base_branch: string;
  template: { repo: string; sha: string };
  /** Viewport in CSS pixels. */
  width: number;
  height: number;
  png_base64: string;
};
