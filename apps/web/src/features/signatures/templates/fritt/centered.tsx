import React from 'react';
import { ISignature } from '@signova/types';
import {
  FrittRoot,
  getFrittFields,
  NameBlock,
  TitleBlock,
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

export const FrittCenter01: React.FC<{ data: Partial<ISignature> }> = ({ data }) =>
  wrap(data, (f) => (
    <>
      <tr>
        <td align="center">
          <NameBlock f={f} align="center" />
          <TitleBlock f={f} useCompany align="center" />
          <SocialRow f={f} align="center" />
        </td>
      </tr>
      <HRule />
      <tr>
        <td align="center">
          <PhoneBlock f={f} />
          <AddressLine f={f} align="center" />
          <WebsiteLine f={f} align="center" />
        </td>
      </tr>
    </>
  ));

export const FrittCenter02: React.FC<{ data: Partial<ISignature> }> = ({ data }) =>
  wrap(data, (f) => (
    <>
      <tr>
        <td align="center">
          <NameBlock f={f} align="center" />
          <TitleBlock f={f} useCompany align="center" />
          <PhoneBlock f={f} />
          <AddressLine f={f} align="center" />
        </td>
      </tr>
      <HRule />
      <tr>
        <td align="center">
          <WebsiteLine f={f} align="center" />
          <SocialRow f={f} align="center" />
        </td>
      </tr>
    </>
  ));

export const FrittCenter03: React.FC<{ data: Partial<ISignature> }> = ({ data }) =>
  wrap(data, (f) => (
    <tr>
      <td align="center" style={{ textAlign: 'center' }}>
        <NameBlock f={f} align="center" />
        <TitleBlock f={f} useCompany align="center" />
        <div style={{ marginTop: 8 }}>
          <PhoneBlock f={f} />
        </div>
        <AddressLine f={f} align="center" />
        <WebsiteLine f={f} align="center" />
        <SocialRow f={f} align="center" />
      </td>
    </tr>
  ));
