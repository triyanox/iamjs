import { PermissionProvider } from '@iamjs/react';
import '@testing-library/jest-dom';
import { act, render } from '@testing-library/react';
import { PermissionProviderTestComponent, PermissionsStingTestComponent } from '../utils';

describe('PermissionProvider', () => {
  it('should set and get permissions correctly', async () => {
    const { getByTestId } = render(
      <PermissionProvider>
        <PermissionProviderTestComponent />
      </PermissionProvider>
    );

    expect(getByTestId('books-create-permission')).toHaveTextContent('false');
    const setPermButton = getByTestId('set-perm-button');

    await act(async () => {
      setPermButton.click();
    });
    expect(getByTestId('books-create-permission')).toHaveTextContent('true');
  });
});

describe('FromJson', () => {
  it('should set and get permissions correctly', async () => {
    const { getByTestId } = render(
      <PermissionProvider>
        <PermissionProviderTestComponent />
      </PermissionProvider>
    );

    expect(getByTestId('books-create-permission')).toHaveTextContent('false');
    const setPermButton = getByTestId('set-perm-button');

    await act(async () => {
      setPermButton.click();
    });
    expect(getByTestId('books-create-permission')).toHaveTextContent('true');
  });
});

describe('PermissionString', () => {
  it('should set and get permissions correctly', async () => {
    const { getByTestId } = render(
      <PermissionProvider>
        <PermissionsStingTestComponent />
      </PermissionProvider>
    );

    expect(getByTestId('books-read-permission')).toHaveTextContent('false');
    const setPermButton = getByTestId('set-perm-button');

    await act(async () => {
      setPermButton.click();
    });
    expect(getByTestId('books-read-permission')).toHaveTextContent('true');
  });
});
