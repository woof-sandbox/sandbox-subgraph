import { BigInt } from '@graphprotocol/graph-ts';
import { Progress } from '../../generated/schema';

export function createOrUpdateProgress(
  progressId: string, // namespace ProgressId
  seekId: string,
  timestamp: BigInt
): Progress {
  let progress = Progress.load(progressId);
  if (!progress) {
    progress = new Progress(progressId);
    //
    progress.createdAt = timestamp;
  }

  progress.seekId = seekId;
  progress.updatedAt = timestamp;
  progress.save();

  return progress;
}
