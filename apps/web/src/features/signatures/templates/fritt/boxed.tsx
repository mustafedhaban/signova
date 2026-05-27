import React from 'react';
import { ISignature } from '@signova/types';
import {
  FrittRoot,
  getFrittFields,
  RedLogo,
  NameBlock,
  TitleBlock,
  AddressLine,
  WebsiteLine,
  PhoneBlock,
  SocialRow,
  GreyPanel,
} from './shared';

const wrap = (data: Partial<ISignature>, body: (f: ReturnType<typeof getFrittFields>) => React.ReactNode) => {
  const f = getFrittFields(data);
  return <FrittRoot f={f}>{body(f)}</FrittRoot>;
};

export const FrittBox01: React.FC<{ data: Partial<ISignature> }> = ({ data }) =>
  wrap(data, (f) => (
    <>
      <tr>
        <RedLogo f={f} />
        <td style={{ verticalAlign: 'top' }}>
          <NameBlock f={f} />
          <TitleBlock f={f} useCompany />
          <AddressLine f={f} />
        </td>
      </tr>
      <GreyPanel>
        <table cellPadding={0} cellSpacing={0} style={{ width: '100%' }}>
          <tbody>
            <tr>
              <td style={{ width: '50%', verticalAlign: 'top' }}>
                <PhoneBlock f={f} />
                <WebsiteLine f={f} />
              </td>
              <td style={{ width: '50%', verticalAlign: 'top' }}>
                <SocialRow f={f} vertical />
              </td>
            </tr>
          </tbody>
        </table>
      </GreyPanel>
    </>
  ));

export const FrittBox02: React.FC<{ data: Partial<ISignature> }> = ({ data }) =>
  wrap(data, (f) => (
    <>
      <tr>
        <RedLogo f={f} size={64} />
        <td style={{ verticalAlign: 'top' }}>
          <NameBlock f={f} />
          <TitleBlock f={f} useCompany />
        </td>
      </tr>
      <GreyPanel>
        <table cellPadding={0} cellSpacing={0} style={{ width: '100%' }}>
          <tbody>
            <tr>
              <td style={{ verticalAlign: 'top', paddingRight: 12 }}>
                <PhoneBlock f={f} compact />
                <AddressLine f={f} />
              </td>
              <td style={{ verticalAlign: 'top' }}>
                <SocialRow f={f} />
                <WebsiteLine f={f} />
              </td>
            </tr>
          </tbody>
        </table>
      </GreyPanel>
    </>
  ));

export const FrittBox03: React.FC<{ data: Partial<ISignature> }> = ({ data }) =>
  wrap(data, (f) => (
    <>
      <tr>
        <RedLogo f={f} />
        <td style={{ verticalAlign: 'top' }}>
          <NameBlock f={f} />
          <TitleBlock f={f} useCompany />
          <AddressLine f={f} />
        </td>
      </tr>
      <GreyPanel bordered>
        <table cellPadding={0} cellSpacing={0} style={{ width: '100%' }}>
          <tbody>
            <tr>
              <td style={{ width: '50%', verticalAlign: 'top' }}>
                <PhoneBlock f={f} />
              </td>
              <td style={{ width: '50%', verticalAlign: 'top' }}>
                <SocialRow f={f} vertical />
              </td>
            </tr>
          </tbody>
        </table>
      </GreyPanel>
    </>
  ));

export const FrittBox04: React.FC<{ data: Partial<ISignature> }> = ({ data }) =>
  wrap(data, (f) => (
    <>
      <tr>
        <RedLogo f={f} size={64} />
        <td style={{ verticalAlign: 'top' }}>
          <NameBlock f={f} />
          <TitleBlock f={f} useCompany />
        </td>
      </tr>
      <GreyPanel bordered>
        <PhoneBlock f={f} />
        <WebsiteLine f={f} />
        <SocialRow f={f} />
      </GreyPanel>
    </>
  ));

export const FrittBox05: React.FC<{ data: Partial<ISignature> }> = ({ data }) =>
  wrap(data, (f) => (
    <>
      <tr>
        <td style={{ verticalAlign: 'top', width: '55%' }}>
          <NameBlock f={f} />
          <TitleBlock f={f} useCompany />
        </td>
        <td style={{ verticalAlign: 'top' }}>
          <table
            cellPadding={0}
            cellSpacing={0}
            style={{
              backgroundColor: '#EEEEEE',
              borderCollapse: 'collapse',
              width: '100%',
            }}
          >
            <tbody>
              <tr>
                <td style={{ padding: 10 }}>
                  <PhoneBlock f={f} compact />
                  <WebsiteLine f={f} />
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
      <GreyPanel colSpan={2}>
        <AddressLine f={f} />
        <SocialRow f={f} />
      </GreyPanel>
    </>
  ));

export const FrittBox06: React.FC<{ data: Partial<ISignature> }> = ({ data }) =>
  wrap(data, (f) => (
    <>
      <tr>
        <td style={{ verticalAlign: 'top', width: '55%' }}>
          <NameBlock f={f} />
          <TitleBlock f={f} useCompany />
        </td>
        <td style={{ verticalAlign: 'top' }}>
          <table
            cellPadding={0}
            cellSpacing={0}
            style={{
              border: '1px solid #CCCCCC',
              borderCollapse: 'collapse',
              width: '100%',
            }}
          >
            <tbody>
              <tr>
                <td style={{ padding: 10 }}>
                  <PhoneBlock f={f} compact />
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
      <GreyPanel bordered colSpan={2}>
        <AddressLine f={f} />
        <WebsiteLine f={f} />
        <SocialRow f={f} />
      </GreyPanel>
    </>
  ));
