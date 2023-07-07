import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
// @ts-ignore
import React from 'react';
import { CanComponent, TestBuildRole, TestShowComponent } from '../utils';

describe('Can', () => {
  it('Should check the permissions on the resource', async () => {
    const { getByTestId } = render(<CanComponent />);
    expect(getByTestId('books-create-permission')).toHaveTextContent('true');
  });
});

describe('Show the component', () => {
  it('Should render the component', async () => {
    const { getByTestId } = render(<TestShowComponent />);
    expect(getByTestId('books-create-permission')).toBeVisible();
    expect(getByTestId('books-create-permission')).toHaveTextContent('true');
  });
});

describe('PermissionString', () => {
  it('should set and get permissions correctly', async () => {
    const { getByTestId } = render(<TestBuildRole />);
    expect(getByTestId('books-create-permission')).toHaveTextContent('false');
  });
});
