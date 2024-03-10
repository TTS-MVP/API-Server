import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({
  expression: `
  SELECT
    user_info.id AS id,
    COALESCE(SUM(vote_acquisition_history.vote_count), 0) - COALESCE(SUM(vote.vote_count), 0) AS voteCount
  FROM
      user_info
  LEFT JOIN (
      SELECT user_id, SUM(vote_count) AS vote_count
      FROM vote_acquisition_history
      GROUP BY user_id
  ) AS vote_acquisition_history ON user_info.id = vote_acquisition_history.user_id

  LEFT JOIN (
      SELECT user_id, SUM(vote_count) AS vote_count
      FROM vote
      GROUP BY user_id
  ) AS vote ON user_info.id = vote.user_id

  GROUP BY user_info.id;

  `,
})
export class UserVoteCountView {
  @ViewColumn()
  id: number;

  @ViewColumn()
  voteCount: number;
}
