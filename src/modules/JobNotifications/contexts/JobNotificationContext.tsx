import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { useSnackbar } from 'notistack';
import { EchoProvider } from '../components/EchoProvider';
import {
  activeJobsAtom,
  jobRequestsAtom,
  upsertJobRequestAtom,
  type JobRequest,
  type JobRequestsMap,
} from '../stores/jobRequestsAtom';
import {
  handleRealtimeJobUpdate,
  syncPendingJobRequests,
} from '../services/JobNotificationService';

interface AuthenticatedUser {
  id?: number;
  use_id?: number;
}

interface JobNotificationProviderProps {
  user: AuthenticatedUser;
  children: React.ReactNode;
}

interface JobNotificationContextValue {
  jobsMap: JobRequestsMap;
  jobs: JobRequest[];
  activeJobs: JobRequest[];
  syncStatus: 'idle' | 'syncing' | 'ready';
}

export const JobNotificationContext =
  createContext<JobNotificationContextValue | null>(null);

const getUserId = (user: AuthenticatedUser): number | null => {
  const raw = user.use_id ?? (user.id as number | string | undefined);

  if (typeof raw === 'number' && Number.isFinite(raw)) {
    return raw;
  }

  if (typeof raw === 'string' && raw.trim().length > 0) {
    const parsed = Number(raw);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return null;
};

const buildJobSuccessMessage = (job: JobRequest): string => {
  return `Job #${job.id} (${job.type}) completed successfully.`;
};

const buildJobErrorMessage = (job: JobRequest): string => {
  const reason = job.error?.trim() ?? 'Unknown processing error';
  return `Job #${job.id} (${job.type}) failed: ${reason}`;
};

export const JobNotificationProvider: React.FC<
  JobNotificationProviderProps
> = ({ user, children }) => {
  const { enqueueSnackbar } = useSnackbar();
  const jobsMap = useAtomValue(jobRequestsAtom);
  const activeJobs = useAtomValue(activeJobsAtom);
  const upsertJob = useSetAtom(upsertJobRequestAtom);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'ready'>(
    'idle',
  );

  const userId = getUserId(user);

  const jobs = useMemo(() => {
    return Array.from(jobsMap.values());
  }, [jobsMap]);

  const notifyJobStarted = useCallback(
    (job: JobRequest) => {
      enqueueSnackbar(`Job #${job.id} (${job.type}) started.`, {
        variant: 'info',
      });
    },
    [enqueueSnackbar],
  );

  const notifyJobCompleted = useCallback(
    (job: JobRequest) => {
      enqueueSnackbar(buildJobSuccessMessage(job), { variant: 'success' });
    },
    [enqueueSnackbar],
  );

  const notifyJobFailed = useCallback(
    (job: JobRequest) => {
      enqueueSnackbar(buildJobErrorMessage(job), { variant: 'error' });
    },
    [enqueueSnackbar],
  );

  const handleJobUpdated = useCallback(
    (payload: unknown) => {
      handleRealtimeJobUpdate({
        payload,
        upsertJob,
        onJobStarted: notifyJobStarted,
        onJobCompleted: notifyJobCompleted,
        onJobFailed: notifyJobFailed,
      });
    },
    [notifyJobCompleted, notifyJobFailed, notifyJobStarted, upsertJob],
  );

  useEffect(() => {
    if (!userId) {
      setSyncStatus('ready');
      return;
    }

    let isMounted = true;

    const syncInitialJobs = async () => {
      setSyncStatus('syncing');

      await syncPendingJobRequests({
        upsertJob: (job) => {
          if (isMounted) {
            upsertJob(job);
          }
        },
        onJobStarted: (job) => {
          if (isMounted) {
            notifyJobStarted(job);
          }
        },
        onJobCompleted: (job) => {
          if (isMounted) {
            notifyJobCompleted(job);
          }
        },
        onJobFailed: (job) => {
          if (isMounted) {
            notifyJobFailed(job);
          }
        },
      });

      if (isMounted) {
        setSyncStatus('ready');
      }
    };

    void syncInitialJobs();

    return () => {
      isMounted = false;
    };
  }, [
    notifyJobCompleted,
    notifyJobFailed,
    notifyJobStarted,
    upsertJob,
    userId,
  ]);

  const contextValue = useMemo<JobNotificationContextValue>(() => {
    return {
      jobsMap,
      jobs,
      activeJobs,
      syncStatus,
    };
  }, [activeJobs, jobs, jobsMap, syncStatus]);

  const content = userId ? (
    <EchoProvider userId={userId} onJobUpdated={handleJobUpdated}>
      {children}
    </EchoProvider>
  ) : (
    children
  );

  return (
    <JobNotificationContext.Provider value={contextValue}>
      {content}
    </JobNotificationContext.Provider>
  );
};
