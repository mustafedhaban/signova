import React from 'react';
import { ISignature } from '@signova/types';
import {
  FrittRoot,
  getFrittFields,
  NameBlock,
  TitleBlock,
  VRule,
  AddressLine,
  WebsiteLine,
  PhoneBlock,
  SocialRow,
  HRule,
} from './shared';

const wrap = (data: Partial<ISignature>, body: (f: ReturnType<typeof getFrittFields>) => React.ReactNode) => {
  const f = getFrittFields(data);
  return <FrittRoot f={f}>{body(f)}</FrittRoot>;
};

export const FrittMin01: React.FC<{ data: Partial<ISignature> }> = ({ data }) =>
  wrap(data, (f) => (
    <tr>
      <td style={{ verticalAlign: 'top', paddingRight: 12 }}>
        <NameBlock f={f} />
        <TitleBlock f={f} useCompany />
      </td>
      <VRule f={f} height={40} />
      <td style={{ verticalAlign: 'top', paddingLeft: 8 }}>
        <AddressLine f={f} />
        <WebsiteLine f={f} />
      </td>
    </tr>
  ));

export const FrittMin02: React.FC<{ data: Partial<ISignature> }> = ({ data }) =>
  wrap(data, (f) => (
    <>
      <tr>
        <td style={{ verticalAlign: 'top', paddingRight: 12 }}>
          <NameBlock f={f} />
          <TitleBlock f={f} useCompany />
          <AddressLine f={f} />
        </td>
        <VRule f={f} />
        <td style={{ verticalAlign: 'top', paddingLeft: 8 }}>
          <PhoneBlock f={f} />
          <WebsiteLine f={f} />
        </td>
      </tr>
      <tr>
        <td colSpan={3}>
          <SocialRow f={f} />
        </td>
      </tr>
    </>
  ));

export const FrittMin03: React.FC<{ data: Partial<ISignature> }> = ({ data }) =>
  wrap(data, (f) => (
    <>
      <tr>
        <td style={{ verticalAlign: 'top', width: '50%', paddingRight: 16 }}>
          <NameBlock f={f} />
          <TitleBlock f={f} useCompany />
        </td>
        <td style={{ verticalAlign: 'top', width: '50%' }}>
          <PhoneBlock f={f} />
          <WebsiteLine f={f} />
        </td>
      </tr>
      <HRule />
      <tr>
        <td colSpan={2}>
          <AddressLine f={f} />
          <SocialRow f={f} />
        </td>
      </tr>
    </>
  ));

export const FrittMin04: React.FC<{ data: Partial<ISignature> }> = ({ data }) =>
  wrap(data, (f) => (
    <tr>
      <td>
        <NameBlock f={f} />
        <TitleBlock f={f} useCompany />
        <PhoneBlock f={f} />
        <AddressLine f={f} />
        <WebsiteLine f={f} />
        <SocialRow f={f} />
      </td>
    </tr>
  ));
