import React from 'react';
import { ISignature } from '@signova/types';
import {
  FrittRoot,
  getFrittFields,
  RedLogo,
  NameBlock,
  TitleBlock,
  TitleBadge,
  VRule,
  AddressLine,
  WebsiteLine,
  PhoneBlock,
  SocialRow,
  FRITT_TEXT,
} from './shared';

const wrap = (data: Partial<ISignature>, body: (f: ReturnType<typeof getFrittFields>) => React.ReactNode) => {
  const f = getFrittFields(data);
  return <FrittRoot f={f}>{body(f)}</FrittRoot>;
};

/** Row 1 — logo left, name beside red rule, address + social below */
export const FrittPhoto01: React.FC<{ data: Partial<ISignature> }> = ({ data }) =>
  wrap(data, (f) => (
    <>
      <tr>
        <RedLogo f={f} size={80} />
        <td style={{ verticalAlign: 'top' }}>
          <table cellPadding={0} cellSpacing={0}>
            <tbody>
              <tr>
                <td style={{ verticalAlign: 'top', paddingRight: 12 }}>
                  <NameBlock f={f} />
                  <TitleBlock f={f} useCompany />
                </td>
                <VRule f={f} />
                <td style={{ verticalAlign: 'top', paddingLeft: 4 }}>
                  <AddressLine f={f} />
                </td>
              </tr>
            </tbody>
          </table>
          <SocialRow f={f} />
        </td>
      </tr>
    </>
  ));

/** Row 2 — logo left, header then two-column contact / social */
export const FrittPhoto02: React.FC<{ data: Partial<ISignature> }> = ({ data }) =>
  wrap(data, (f) => (
    <>
      <tr>
        <RedLogo f={f} />
        <td style={{ verticalAlign: 'top' }}>
          <NameBlock f={f} />
          <TitleBlock f={f} useCompany />
          <AddressLine f={f} />
          <table cellPadding={0} cellSpacing={0} style={{ width: '100%', marginTop: 10 }}>
            <tbody>
              <tr>
                <td style={{ verticalAlign: 'top', width: '50%' }}>
                  <PhoneBlock f={f} />
                  <WebsiteLine f={f} />
                </td>
                <td style={{ verticalAlign: 'top', width: '50%' }}>
                  <SocialRow f={f} vertical />
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </>
  ));

/** Row 2 variant — tighter contact grid */
export const FrittPhoto03: React.FC<{ data: Partial<ISignature> }> = ({ data }) =>
  wrap(data, (f) => (
    <>
      <tr>
        <RedLogo f={f} size={64} />
        <td style={{ verticalAlign: 'top' }}>
          <NameBlock f={f} fontSize={15} />
          <TitleBlock f={f} useCompany />
          <table cellPadding={0} cellSpacing={0} style={{ marginTop: 8, width: '100%' }}>
            <tbody>
              <tr>
                <td colSpan={2}>
                  <AddressLine f={f} />
                </td>
              </tr>
              <tr>
                <td style={{ paddingTop: 8, verticalAlign: 'top' }}>
                  <PhoneBlock f={f} compact />
                </td>
                <td style={{ paddingTop: 8, verticalAlign: 'top' }}>
                  <SocialRow f={f} />
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </>
  ));

/** Row 3 — name | title on one row with grey bar */
export const FrittPhoto04: React.FC<{ data: Partial<ISignature> }> = ({ data }) =>
  wrap(data, (f) => (
    <>
      <tr>
        <RedLogo f={f} />
        <td style={{ verticalAlign: 'top' }}>
          <table cellPadding={0} cellSpacing={0}>
            <tbody>
              <tr>
                <td style={{ paddingRight: 10 }}>
                  <NameBlock f={f} />
                </td>
                <td style={{ width: 1, backgroundColor: '#999' }} />
                <td style={{ paddingLeft: 10 }}>
                  <TitleBlock f={f} useCompany color={FRITT_TEXT} />
                </td>
              </tr>
            </tbody>
          </table>
          <AddressLine f={f} />
          <WebsiteLine f={f} />
        </td>
      </tr>
    </>
  ));

/** Row 3 — address + vertical social list */
export const FrittPhoto05: React.FC<{ data: Partial<ISignature> }> = ({ data }) =>
  wrap(data, (f) => (
    <>
      <tr>
        <RedLogo f={f} />
        <td style={{ verticalAlign: 'top' }}>
          <NameBlock f={f} />
          <TitleBlock f={f} useCompany />
          <AddressLine f={f} />
          <SocialRow f={f} vertical />
          <WebsiteLine f={f} />
        </td>
      </tr>
    </>
  ));

/** Row 4 — title in red badge */
export const FrittPhoto06: React.FC<{ data: Partial<ISignature> }> = ({ data }) =>
  wrap(data, (f) => (
    <>
      <tr>
        <RedLogo f={f} size={76} />
        <td style={{ verticalAlign: 'top' }}>
          <NameBlock f={f} fontSize={18} />
          <TitleBadge f={f} />
          <AddressLine f={f} />
          <PhoneBlock f={f} />
          <SocialRow f={f} />
        </td>
      </tr>
    </>
  ));

/** Row 10 — stacked lines with logo */
export const FrittPhoto07: React.FC<{ data: Partial<ISignature> }> = ({ data }) =>
  wrap(data, (f) => (
    <>
      <tr>
        <RedLogo f={f} size={68} />
        <td style={{ verticalAlign: 'top' }}>
          <NameBlock f={f} />
          <TitleBlock f={f} useCompany />
          <PhoneBlock f={f} />
          <AddressLine f={f} />
          <WebsiteLine f={f} />
          <SocialRow f={f} />
        </td>
      </tr>
    </>
  ));
