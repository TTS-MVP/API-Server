import { ViewEntity, ViewColumn } from 'typeorm';
import { View } from 'typeorm/schema-builder/view/View';

@ViewEntity({
  expression: `
    SELECT
      artist_id AS id,
      name,
      thumbnail_url AS thumbnailUrl,
      SUM(vote_count) AS voteCount
    FROM
      vote
    LEFT JOIN 
      artist
    ON 
      artist.id = vote.artist_id
    GROUP BY
      artist_id
    ORDER BY
      voteCount DESC
  `,
})
export class MonthlyArtistVoteView {
  @ViewColumn()
  id: number;

  @ViewColumn()
  name: string;

  @ViewColumn()
  thumbnailUrl: string;

  @ViewColumn()
  voteCount: number;
}
