// @flow

import React, { useEffect } from 'react';
import type { ComponentType } from 'react';
import { Tabs } from 'govuk-react-jsx/govuk/components/tabs';
import { Table } from 'govuk-react-jsx/govuk/components/table';
import numeral from 'numeral';

import useHash from 'hooks/useHash';

import type { Props } from './RegionTable.types';
import * as Styles from './RegionTable.styles';

const LinkOrText = ({ children, ...props }) => {
  return (
    <>
      <Styles.DesktopName {...props} role="button" tabIndex={0} href={null} className="govuk-link">{children}</Styles.DesktopName>
      <Styles.MobileName {...props}>{children}</Styles.MobileName>
    </>
  );
};

const RegionTable: ComponentType<Props> = ({
  country,
  setCountry,
  countryData,
  region,
  setRegion,
  regionData,
  utla,
  setUtla,
  utlaData,
}: Props) => {
  const hash = useHash();

  useEffect(() => {
    const element = document.getElementById(`tab_${hash.replace('#', '')}`);
    if (element) {
      element.click();
    }
  }, [hash]);

  useEffect(() => {
    const containerId = (() => {
      if (country) {
        return 'country';
      }
      if (region) {
        return 'regions';
      }
      if (utla) {
        return 'local-authorities';
      }
      return '';
    })();

    const itemId = `table-link-${country || region || utla || ''}`;

    const container = document.getElementById(containerId);
    const item = document.getElementById(itemId);
    if (container && item && item.offsetParent) {
      // $FlowFixMe
      container.scrollTop = item.offsetParent.offsetTop - 10;
    }
  }, [country, region, utla]);

  const handleKeyDown = (type: 'countries' | 'regions' | 'utlas') => (r: string) => (event: SyntheticKeyboardEvent<*>) => {
    if (setCountry && setRegion && setUtla && event.key === 'Enter') {
      setCountry(type === 'countries' ? r : null);
      setRegion(type === 'regions' ? r : null);
      setUtla(type === 'utlas' ? r : null);
    }
  }

  const handleOnCountryKeyDown = handleKeyDown('countries');
  const handleOnRegionKeyDown = handleKeyDown('regions');
  const handleOnUtlaKeyDown = handleKeyDown('utlas');

  const handleOnClick = (type: 'countries' | 'regions' | 'utlas') => (r: string) => () => {
    if (setCountry && setRegion && setUtla) {
      setCountry(type === 'countries' ? r : null);
      setRegion(type === 'regions' ? r : null);
      setUtla(type === 'utlas' ? r : null);
    }
  }

  const handleOnCountryClick = handleOnClick('countries');
  const handleOnRegionClick = handleOnClick('regions');
  const handleOnUtlaClick = handleOnClick('utlas');

  const countryKeys = Object.keys(countryData);
  const regionKeys = Object.keys(regionData);
  const utlaKeys = Object.keys(utlaData);

  const sortFunc = (d: CountryData | RegionData | UtlaData) => (a, b) => {
    // $FlowFixMe
    const aValue = d?.[a]?.name?.value;
    // $FlowFixMe
    const bValue = d?.[b]?.name?.value;

    if (aValue < bValue) return -1;
    if (aValue > bValue) return 1;
    return 0;
  };

  return (
    <Styles.Container>
      <Tabs
        items={[
          {
            id: 'countries',
            label: 'Nations',
            panel: {
              children: [
                <Table key='countries'
                  head={[{ children: ['Nation'] }, { children: ['Total cases'], format: 'numeric' }, { children: ['Deaths'], format: 'numeric' }]}
                  rows={countryKeys.sort(sortFunc(countryData)).map(r => [
                    { children: [<LinkOrText id={`table-link-${r}`} key={`table-link-${r}`} onClick={handleOnCountryClick(r)} onKeyPress={handleOnCountryKeyDown} active={country === r}>{countryData[r].name.value}</LinkOrText>] },
                    { children: [numeral(countryData[r].totalCases.value).format('0,0')], format: 'numeric' },
                    { children: [numeral(countryData[r].deaths.value).format('0,0')], format: 'numeric' },
                  ])}
                />
              ],
            }
          },
          {
            id: 'regions',
            label: 'Regions',
            panel: {
              children: [
                <Table key='regions'
                  head={[{ children: ['Region'] }, { children: ['Total cases'], format: 'numeric' }]}
                  rows={regionKeys.sort(sortFunc(regionData)).map(r => [
                    { children: [<LinkOrText id={`table-link-${r}`} key={`table-link-${r}`} onClick={handleOnRegionClick(r)} onKeyPress={handleOnRegionKeyDown} active={region === r}>{regionData[r].name.value}</LinkOrText>] },
                    { children: [numeral(regionData[r].totalCases.value).format('0,0')], format: 'numeric' },
                  ])}
                />
              ],
            }
          },
          {
            id: 'local-authorities',
            label: 'Upper tier local authorities',
            panel: {
              children: [
                <Table key='local-authorities'
                  head={[{ children: ['UTLA'] }, { children: ['Total cases'], format: 'numeric' }]}
                  rows={utlaKeys.sort(sortFunc(utlaData)).map(r => [
                    { children: [<LinkOrText id={`table-link-${r}`} key={`table-link-${r}`} onClick={handleOnUtlaClick(r)} onKeyPress={handleOnUtlaKeyDown} active={utla === r}>{utlaData[r].name.value}</LinkOrText>] },
                    { children: [numeral(utlaData[r].totalCases.value).format('0,0')], format: 'numeric' },
                  ])}
                />
              ],
            }
          },
        ]}
      />
    </Styles.Container>
  );
};

export default RegionTable;
