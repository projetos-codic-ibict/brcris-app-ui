/* eslint-disable @typescript-eslint/no-explicit-any */
import { ResultViewProps } from '@elastic/react-search-ui-views'

type Author = {
  id: string
  name: string
}
type OrgUnit = {
  id: string
  name: string
}

type Service = {
  id: string
  title: string[]
}

const VIVO_URL_BASE = process.env.VIVO_URL_BASE

const CustomResultViewPublications = ({
  result,
  onClickLink,
}: ResultViewProps) => (
  <li className="sui-result">
    <div>
      <div className="sui-result__header">
        <h6>
          <a
            onClick={onClickLink}
            target="_blank"
            href={`${VIVO_URL_BASE}/pub_${result.id.raw}`}
            rel="noreferrer"
          >
            {result.title.raw}
          </a>
        </h6>
      </div>

      <div className="sui-result__body">
        <ul className="sui-result__details">
          <li>
            <span className="sui-result__key">Year</span>
            <span className="sui-result__value">
              {result.publicationDate?.raw}
            </span>
          </li>

          <li>
            <span className="sui-result__key">Author(s)</span>
            <span className="sui-result__value">
              {result.author?.raw.map((author: Author) => (
                <a
                  key={author.id}
                  target="_blank"
                  href={`${VIVO_URL_BASE}/individual?uri=https%3A%2F%2Fibict.br%2Fbrcris%2Findividual%2Fpers_${author.id}`}
                  rel="noreferrer"
                >
                  {author.name}
                </a>
              ))}
            </span>
          </li>

          <li>
            <span className="sui-result__key">Type</span>
            <span className="sui-result__value">{result.type?.raw}</span>
          </li>

          <li>
            <span className="sui-result__key">
              {' '}
              {result.type?.raw == 'doctoral thesis' ||
              result.type?.raw == 'master thesis'
                ? 'Institution'
                : result.type?.raw == 'conference proceedings'
                ? 'Organization'
                : 'Journal'}
              {''}
            </span>

            <span className="sui-result__value">
              {result.orgunit?.raw.map((org: OrgUnit) => (
                <a
                  key={org.id}
                  target="_blank"
                  rel="noreferrer"
                  href={`${VIVO_URL_BASE}/${org.name}`}
                >
                  {org.name}
                </a>
              ))}

              {result.service?.raw.map((service: Service) =>
                service.title.map((title: string) => (
                  <a
                    key={title}
                    target="_blank"
                    rel="noreferrer"
                    href={`${VIVO_URL_BASE}/${service.id}`}
                  >
                    {title}
                  </a>
                ))
              )}

              {result.journal?.raw.map((journal: any, index: any) => (
                <a
                  key={index}
                  target="_blank"
                  rel="noreferrer"
                  href={`${VIVO_URL_BASE}/${journal.id}`}
                >
                  {journal.title ? journal.title : journal}
                </a>
              ))}
            </span>
          </li>
        </ul>
      </div>
    </div>
  </li>
)

export default CustomResultViewPublications