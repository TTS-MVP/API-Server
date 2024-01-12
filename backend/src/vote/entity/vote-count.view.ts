import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({
  expression: `
    SELECT
      vote_acquisition_history.user_id AS id,
      (COALESCE(SUM(DISTINCT vote_acquisition_history.vote_count), 0) - COALESCE(SUM(DISTINCT vote.vote_count), 0)) AS voteCount
    FROM
      vote_acquisition_history
    JOIN
      vote
    ON
      vote_acquisition_history.user_id = vote.user_id
    GROUP BY
      vote_acquisition_history.user_id
  `,
})
export class UserVoteCountView {
  @ViewColumn()
  id: number;

  @ViewColumn()
  voteCount: number;
}
