/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import { render } from 'spec/helpers/testing-library';
import { NativeFilterType, Filter, Preset } from '@superset-ui/core';
import { FilterBarOrientation } from 'src/dashboard/types';
import { RangeFilterPlugin } from 'src/filters/components';
import FilterControl from './FilterControl';
import { FilterBarScrollContext } from '../Vertical';

class TestPreset extends Preset {
  constructor() {
    super({
      name: 'Test filters',
      plugins: [new RangeFilterPlugin().configure({ key: 'filter_range' })],
    });
  }
}

new TestPreset().register();

const mockFilter: Filter = {
  id: 'test-filter-id',
  name: 'Test Filter',
  filterType: 'filter_select',
  targets: [{ datasetId: 1, column: { name: 'test_column' } }],
  defaultDataMask: {},
  controlValues: {},
  cascadeParentIds: [],
  scope: { rootPath: [], excluded: [] },
  type: NativeFilterType.NativeFilter,
  description: 'Test filter description',
};

const mockProps = {
  filter: mockFilter,
  onFilterSelectionChange: jest.fn(),
  inView: true,
  showOverflow: false,
  parentRef: { current: null },
};

const mockInitialState = {
  dashboardLayout: {
    present: {},
    past: [],
    future: [],
  },
  dashboardState: {
    activeTabs: [],
  },
  nativeFilters: {
    filters: {},
  },
};

test('vertical FilterControl applies default spacing', () => {
  const { container } = render(
    <FilterBarScrollContext.Provider value={false}>
      <FilterControl
        {...mockProps}
        orientation={FilterBarOrientation.Vertical}
      />
    </FilterBarScrollContext.Provider>,
    { useRedux: true, initialState: mockInitialState },
  );

  const formItems = container.querySelectorAll('.ant-form-item');
  expect(formItems.length).toBeGreaterThan(0);

  const firstFormItem = formItems[0] as HTMLElement;
  const styles = getComputedStyle(firstFormItem);
  const marginValue = parseInt(styles.marginBottom, 10);

  expect(marginValue).toBe(24);
});

test('horizontal FilterControl renders correctly', () => {
  const { container } = render(
    <FilterBarScrollContext.Provider value={false}>
      <FilterControl
        {...mockProps}
        orientation={FilterBarOrientation.Horizontal}
      />
    </FilterBarScrollContext.Provider>,
    { useRedux: true, initialState: mockInitialState },
  );

  expect(container.querySelector('.ant-form-item')).toBeInTheDocument();
});
