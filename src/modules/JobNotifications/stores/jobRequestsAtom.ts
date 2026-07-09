import { atom } from 'jotai';

export interface JobRequest {
  id: number;
  type: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  started_at?: string;
  completed_at?: string;
  error?: string;
}

export type JobRequestsMap = Map<number, JobRequest>;

export const isJobActiveStatus = (status: JobRequest['status']): boolean => {
  return status === 'pending' || status === 'running';
};

export const jobRequestsAtom = atom<JobRequestsMap>(new Map());

export const upsertJobRequestAtom = atom(null, (get, set, job: JobRequest) => {
  const next = new Map(get(jobRequestsAtom));
  next.set(job.id, job);
  set(jobRequestsAtom, next);
});

export const setJobRequestsAtom = atom(null, (get, set, jobs: JobRequest[]) => {
  const next = new Map(get(jobRequestsAtom));
  jobs.forEach((job) => {
    next.set(job.id, job);
  });
  set(jobRequestsAtom, next);
});

export const removeJobRequestAtom = atom(null, (get, set, id: number) => {
  const next = new Map(get(jobRequestsAtom));
  next.delete(id);
  set(jobRequestsAtom, next);
});

export const jobsListAtom = atom((get) => {
  return Array.from(get(jobRequestsAtom).values());
});

export const activeJobsAtom = atom((get) => {
  return get(jobsListAtom).filter((job) => isJobActiveStatus(job.status));
});
