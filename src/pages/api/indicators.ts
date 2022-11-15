/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Client } from 'es7'
import { Filter } from '@elastic/search-ui'

const client = new Client({
  maxRetries: 5,
  requestTimeout: 60000,
  sniffOnStart: true,
  node: process.env.HOST,
  auth: {
    apiKey: process.env.API_KEY!,
  },
})

const queryTextModel = {
  _source: [],
  size: 0,
  aggs: {
    genres: {
      terms: {
        field: '',
        size: 100,
        order: {
          _key: 'desc',
        },
      },
    },
  },
  query: {
    bool: {
      must: {
        query_string: {
          query: '*',
        },
      },
      filter: [],
    },
  },
}

type RequestData = {
  searchTerm: string
  indicator: string
  filters: Filter[]
}

function fillQuery(data: RequestData) {
  const queryText = JSON.parse(JSON.stringify(queryTextModel))

  if (data.indicator) {
    queryText._source = [data.indicator]
    queryText.aggs.genres.terms.field = data.indicator
  }

  if (data.searchTerm) {
    queryText.query.bool.must.query_string.query = data.searchTerm + '*'
  } else {
    queryText.query.bool.must.query_string.query = '*'
  }
  if (data.filters && data.filters.length > 0) {
    queryText.query.bool.filter = []
    data.filters.forEach((filter) => {
      queryText.query.bool.filter.push({
        terms: { [filter.field]: filter.values },
      })
    })
  } else {
    queryText.query.bool.filter = []
  }
  return queryText
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const proxy = async (req: any, res: any) => {
  const datas: RequestData[] = JSON.parse(req.body)
  const querys: any[] = []

  datas.forEach((data) => {
    const queryText = fillQuery(data)
    querys.push({ index: 'pqseniors-pubs' })
    querys.push(queryText)
  })

  // https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/7.17/msearch_examples.html
  const { body } = await client.msearch({
    body: querys,
  })

  const buckets = body.responses.map(
    (resp: any) => resp.aggregations.genres.buckets
  )

  res.json(buckets)
}

export default proxy