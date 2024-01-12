import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
  expression: `
    SELECT
      artist.id AS id,
      artist.name,
      artist.thumbnail_url AS thumbnailUrl,
      COALESCE(SUM(user_profile.favorite_artist_id), 0) AS likeCount
    FROM
      artist
    LEFT JOIN 
      user_profile
    ON 
      artist.id = user_profile.favorite_artist_id
    GROUP BY
      artist.id
    ORDER BY
      likeCount DESC,
      artist.name ASC
  `,
})
export class ArtistFanCountView {
  @ViewColumn()
  id: number;

  @ViewColumn()
  name: string;

  @ViewColumn()
  thumbnailUrl: string;

  @ViewColumn()
  likeCount: number;
}
