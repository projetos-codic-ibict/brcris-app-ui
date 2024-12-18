/* eslint-disable @typescript-eslint/ban-ts-comment */

import {
  ErrorBoundary,
  Facet,
  Paging,
  PagingInfo,
  Results,
  ResultsPerPage,
  SearchProvider,
  Sorting,
  WithSearch,
} from '@elastic/react-search-ui';
import { Layout } from '@elastic/react-search-ui-views';
import '@elastic/react-search-ui-views/lib/styles/styles.css';
import { QueryDslOperator } from 'es7/api/types';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { useState } from 'react';
import { containsResults } from '../../utils/Utils';
import CustomSearchBox from '../components/CustomSearchBox';
import DefaultQueryConfig from '../components/DefaultQueryConfig';
import DownloadModal from '../components/DownloadModal';
import Loader from '../components/Loader';
import { CustomProvider } from '../components/context/CustomContext';
import CustomResultViewPublications from '../components/customResultView/CustomResultViewPublications';
import CustomViewPagingInfo from '../components/customResultView/CustomViewPagingInfo';
import Indicators from '../components/indicators/PublicationsIndicators';
import styles from '../styles/Home.module.css';
import { CustomSearchDriverOptions } from '../types/Entities';
type Props = {
  // Add custom props here
};
export const getServerSideProps: GetServerSideProps<Props> = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common', 'navbar', 'advanced'])),
  },
});

const INDEX_NAME = process.env.INDEX_PUBLICATION || '';
const configDefault: CustomSearchDriverOptions = {
  ...DefaultQueryConfig(INDEX_NAME),
  searchQuery: {
    operator: 'OR',
    index: INDEX_NAME,
    search_fields: {
      title_text: {
        weight: 3,
      },
      publicationDate: {},
      'author.name': {},
      language: {},
      type: {},
      'orgunit.name': {},
      keyword_text: {},
    },
    result_fields: {
      title: {
        snippet: {},
      },
      publicationDate: {
        snippet: {},
      },
      author: {
        raw: [],
      },
      keyword: {
        snippet: {},
      },
      journal: {
        raw: {},
      },
      type: {
        raw: {},
      },
      orgunit: {
        snippet: {},
      },
      service: {
        raw: {},
      },
      vivo_link: {
        raw: {},
      },
      language: {
        raw: [],
      },
      cnpqResearchArea: {
        raw: [],
      },
    },
    disjunctiveFacets: [
      'language.type',
      'author.name',
      'keyword.type',
      'cnpqResearchArea.type',
      'publicationDate.type',
    ],

    facets: {
      language: { type: 'value' },
      'author.name': { type: 'value' },
      keyword: { type: 'value' },
      'orgunit.name': { type: 'value' },
      'journal.title': { type: 'value' },
      type: { type: 'value' },
      cnpqResearchArea: { type: 'value' },
      publicationDate: {
        type: 'range',
        ranges: [
          {
            from: '2021',
            to: new Date().getUTCFullYear().toString(),
            name: `2021 - ${new Date().getUTCFullYear()}`,
          },
          {
            from: '2016',
            to: '2020',
            name: '2016 - 2020',
          },
          {
            from: '2011',
            to: '2015',
            name: '2011 - 2015',
          },
          {
            from: '2001',
            to: '2010',
            name: '2001 - 2010',
          },
          {
            from: '1991',
            to: '2000',
            name: '1991 - 2000',
          },
          {
            from: '1950',
            to: '1990',
            name: '1950 - 1990',
          },
        ],
      },
    },
  },
  autocompleteQuery: {
    results: {
      resultsPerPage: 5,
      search_fields: {
        title_suggest: {
          weight: 3,
        },
      },
      result_fields: {
        title: {
          snippet: {
            size: 100,
            fallback: true,
          },
        },
        vivo_link: {
          raw: {},
        },
      },
    },
    suggestions: {
      types: {
        results: { fields: ['title_completion'] },
      },
      size: 5,
    },
  },
};
type SortOptionsType = {
  name: string;
  value: any[];
};
const SORT_OPTIONS: SortOptionsType[] = [
  {
    name: 'Relevance',
    value: [],
  },
  {
    name: 'Ano ASC',
    value: [
      {
        field: 'publicationDate',
        direction: 'asc',
      },
    ],
  },
  {
    name: 'Ano DESC',
    value: [
      {
        field: 'publicationDate',
        direction: 'desc',
      },
    ],
  },
];
export default function App() {
  const { t } = useTranslation('common');
  // tradução
  SORT_OPTIONS.forEach((option) => (option.name = t(option.name)));

  const [config, setConfig] = useState(configDefault);

  function updateOpetatorConfig(op: QueryDslOperator) {
    setConfig({ ...config, searchQuery: { ...config.searchQuery, operator: op } });
  }
  const typeArqw = 'ris';
  return (
    <div>
      <Head>
        <title>{`BrCris - ${t('Publications')}`}</title>
      </Head>
      <div className="page-search">
        <CustomProvider>
          <SearchProvider config={config}>
            <WithSearch
              mapContextToProps={({ wasSearched, results, isLoading }) => ({ wasSearched, results, isLoading })}
            >
              {({ wasSearched, results, isLoading }) => {
                return (
                  <div className="App">
                    <div className="container page">
                      <div className="page-title">
                        <h1>{t('Publications')}</h1>
                      </div>
                    </div>
                    <div className={styles.content}>
                      <div className={styles.searchLayout}>
                        {isLoading ? <Loader /> : ''}
                        <Layout
                          header={
                            <CustomSearchBox
                              titleFieldName="title"
                              itemLinkPrefix="publ_"
                              updateOpetatorConfig={updateOpetatorConfig}
                              indexName={INDEX_NAME}
                              fieldNames={Object.keys(config.searchQuery.search_fields as object)}
                            />
                          }
                          sideContent={
                            <ErrorBoundary className={styles.searchErrorHidden}>
                              {containsResults(wasSearched, results) && (
                                <>
                                  <Sorting label={t('Sort by') || ''} sortOptions={SORT_OPTIONS} />
                                  <div className="filters">
                                    <span className="sui-sorting__label">{t('Filters')}</span>
                                  </div>
                                </>
                              )}
                              {containsResults(wasSearched, results) && (
                                <>
                                  <Facet key={'1'} field={'language'} label={t('Language')} />
                                  <Facet key={'2'} field={'author.name'} label={t('Authors')} />
                                  <Facet key={'3'} field={'keyword'} label={t('Keyword')} />
                                  <Facet key={'4'} field={'orgunit.name'} label={t('Institution')} />
                                  <Facet key={'5'} field={'journal.title'} label={t('Journal')} />
                                  <Facet key={'6'} field={'type'} label={t('Type')} />
                                  <Facet key={'7'} field={'cnpqResearchArea'} label={t('CNPq research area')} />
                                  <Facet key={'8'} field={'publicationDate'} filterType={'none'} label={t('Year')} />
                                </>
                              )}
                            </ErrorBoundary>
                          }
                          bodyContent={
                            <ErrorBoundary
                              className={styles.searchError}
                              view={({ className, error }) => (
                                <>
                                  {error && <p className={`sui-search-error ${className}`}>{t(error.trim())}</p>}
                                  {!error && wasSearched && results.length == 0 && (
                                    <strong>{t('No documents were found for your search')}</strong>
                                  )}
                                  {!error && (
                                    <>
                                      <div className="result">
                                        <Results resultView={CustomResultViewPublications} /> <Paging />
                                      </div>
                                      <Indicators />
                                    </>
                                  )}
                                </>
                              )}
                            ></ErrorBoundary>
                          }
                          bodyHeader={
                            <ErrorBoundary className={styles.searchErrorHidden}>
                              {containsResults(wasSearched, results) && (
                                <div className="d-flex align-items-center">
                                  <PagingInfo view={CustomViewPagingInfo} />
                                </div>
                              )}

                              {containsResults(wasSearched, results) && (
                                <div className="d-flex gap-2  align-items-center">
                                  {
                                    <>
                                      <ResultsPerPage options={[10, 20, 50]} />
                                      {/* @ts-ignore */}
                                      <DownloadModal typeArq={typeArqw} />
                                      <DownloadModal />{' '}
                                    </>
                                  }
                                </div>
                              )}
                            </ErrorBoundary>
                          }
                          // bodyFooter={}
                        />
                      </div>
                    </div>
                  </div>
                );
              }}
            </WithSearch>
          </SearchProvider>
        </CustomProvider>
      </div>
    </div>
  );
}
