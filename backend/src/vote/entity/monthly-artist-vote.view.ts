import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({
  expression: `
    SELECT
      artist.id AS id,
      artist.name,
      artist.thumbnail_url AS thumbnailUrl,
      COALESCE(SUM(vote.vote_count), 0) AS voteCount
    FROM
      artist
    LEFT JOIN 
      vote
    ON 
      artist.id = vote.artist_id
    GROUP BY
      artist.id
    ORDER BY
      voteCount DESC,
      artist.name ASC
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
