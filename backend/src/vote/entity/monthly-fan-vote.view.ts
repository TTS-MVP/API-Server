import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({
  expression: `
    SELECT
      user_profile.id AS id,
      user_profile.favorite_artist_id AS favoriteArtistId,
      user_profile.nick_name AS name,
      user_profile.thumbnail_url AS thumbnailUrl,
      COALESCE(SUM(vote.vote_count), 0) AS voteCount
    FROM
      user_profile
    LEFT JOIN 
      vote
    ON 
    user_profile.id = vote.user_id
    GROUP BY
      user_profile.id
    ORDER BY
      voteCount DESC,
      user_profile.nick_name ASC
  `,
})
export class MonthlyFanVoteView {
  @ViewColumn()
  id: number;

  @ViewColumn()
  favoriteArtistId: number;

  @ViewColumn()
  name: string;

  @ViewColumn()
  thumbnailUrl: string;

  @ViewColumn()
  voteCount: number;
}
