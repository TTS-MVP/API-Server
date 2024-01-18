import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({
  expression: `
    SELECT
    user_info.id AS id,
    COALESCE(SUM(DISTINCT vote_acquisition_history.vote_count), 0) - COALESCE(SUM(vote.vote_count), 0) AS voteCount
  FROM
    user_info
  LEFT JOIN
    vote_acquisition_history
  ON
    user_info.id = vote_acquisition_history.user_id
  LEFT JOIN
    vote
  ON
    user_info.id = vote.user_id
  GROUP BY
    user_info.id;
  `,
})
export class UserVoteCountView {
  @ViewColumn()
  id: number;

  @ViewColumn()
  voteCount: number;
}
