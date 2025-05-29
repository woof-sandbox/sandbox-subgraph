import { Progress } from '../../generated/schema';

export function getProgress(progressId: string): Progress | null {
  return Progress.load(progressId);
}
