import api from '../../../Services/api';
import { isJobActiveStatus, type JobRequest } from '../stores/jobRequestsAtom';

const ACTIVE_JOB_IDS_STORAGE_KEY = 'fdo.active-job-ids';

interface SyncPendingJobRequestsParams {
  upsertJob: (job: JobRequest) => void;
  onJobStarted: (job: JobRequest) => void;
  onJobCompleted: (job: JobRequest) => void;
  onJobFailed: (job: JobRequest) => void;
}

interface HandleRealtimeJobUpdateParams extends SyncPendingJobRequestsParams {
  payload: unknown;
}

interface JobRequestEventPayload {
  job_request?: unknown;
  jobRequest?: unknown;
  data?: unknown;
}

const isValidJobStatus = (status: unknown): status is JobRequest['status'] => {
  return status === 'pending' || status === 'running' || status === 'completed' || status === 'failed';
};

const toNumber = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string' && value.trim().length > 0) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return null;
};

const normalizeJobRequest = (value: unknown): JobRequest | null => {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const raw = value as Record<string, unknown>;
  const id = toNumber(raw.id);

  if (id === null || typeof raw.type !== 'string' || !isValidJobStatus(raw.status)) {
    return null;
  }

  return {
    id,
    type: raw.type,
    status: raw.status,
    started_at: typeof raw.started_at === 'string' ? raw.started_at : undefined,
    completed_at: typeof raw.completed_at === 'string' ? raw.completed_at : undefined,
    error: typeof raw.error === 'string' ? raw.error : undefined,
  };
};

const extractJobRequestFromResponse = (value: unknown): JobRequest | null => {
  const direct = normalizeJobRequest(value);
  if (direct) {
    return direct;
  }

  if (!value || typeof value !== 'object') {
    return null;
  }

  const firstLevelData = (value as { data?: unknown }).data;
  const firstLevelParsed = normalizeJobRequest(firstLevelData);
  if (firstLevelParsed) {
    return firstLevelParsed;
  }

  if (!firstLevelData || typeof firstLevelData !== 'object') {
    return null;
  }

  return normalizeJobRequest((firstLevelData as { data?: unknown }).data);
};

const readActiveJobIdsFromStorage = (): number[] => {
  const raw = localStorage.getItem(ACTIVE_JOB_IDS_STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as { activeJobIds?: unknown };
    const activeJobIds = Array.isArray(parsed.activeJobIds) ? parsed.activeJobIds : [];

    return activeJobIds
      .map((id) => toNumber(id))
      .filter((id): id is number => id !== null);
  } catch {
    return [];
  }
};

const writeActiveJobIdsToStorage = (jobIds: number[]): void => {
  if (jobIds.length === 0) {
    localStorage.removeItem(ACTIVE_JOB_IDS_STORAGE_KEY);
    return;
  }

  localStorage.setItem(
    ACTIVE_JOB_IDS_STORAGE_KEY,
    JSON.stringify({ activeJobIds: Array.from(new Set(jobIds)) }),
  );
};

const persistJobReference = (job: JobRequest): void => {
  const ids = new Set(readActiveJobIdsFromStorage());

  if (isJobActiveStatus(job.status)) {
    ids.add(job.id);
  } else {
    ids.delete(job.id);
  }

  writeActiveJobIdsToStorage(Array.from(ids));
};

const notifyTerminalJob = (
  job: JobRequest,
  params: Pick<SyncPendingJobRequestsParams, 'onJobCompleted' | 'onJobFailed' | 'onJobStarted'>,
): void => {
  if (isJobActiveStatus(job.status)) {
    params.onJobStarted(job);
    return;
  }
  if (job.status === 'completed') {
    params.onJobCompleted(job);
    return;
  }

  if (job.status === 'failed') {
    params.onJobFailed(job);
  }
};

const fetchJobRequestById = async(id: number): Promise<JobRequest | null> => {
  const response = await api.get(`/api/job-requests/${id}`);
  return extractJobRequestFromResponse(response.data);
};

export const syncPendingJobRequests = async(params: SyncPendingJobRequestsParams): Promise<void> => {
  const pendingIds = readActiveJobIdsFromStorage();
  if (pendingIds.length === 0) {
    return;
  }

  const activeIds: number[] = [];

  for (const jobId of pendingIds) {
    try {
      const job = await fetchJobRequestById(jobId);
      if (!job) {
        activeIds.push(jobId);
        continue;
      }

      params.upsertJob(job);
      persistJobReference(job);

      if (isJobActiveStatus(job.status)) {
        activeIds.push(job.id);
      } else {
        notifyTerminalJob(job, params);
      }
    } catch {
      activeIds.push(jobId);
    }
  }

  writeActiveJobIdsToStorage(activeIds);
};

export const handleRealtimeJobUpdate = (params: HandleRealtimeJobUpdateParams): void => {
  const payload = params.payload as JobRequestEventPayload;
  const rawJob = payload.job_request ?? payload.jobRequest ?? payload.data ?? params.payload;
  const job = extractJobRequestFromResponse(rawJob);

  if (!job) {
    return;
  }

  params.upsertJob(job);
  persistJobReference(job);

  if (!isJobActiveStatus(job.status)) {
    notifyTerminalJob(job, params);
  }
};
