// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/cli
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

'use strict';

const path = require('path');
const assert = require('yeoman-assert');
const testlab = require('@loopback/testlab');
const fs = require('fs');

const expect = testlab.expect;
const TestSandbox = testlab.TestSandbox;

const generator = path.join(__dirname, '../../../generators/relation');
const SANDBOX_FILES = require('../../fixtures/relation').SANDBOX_FILES;
const testUtils = require('../../test-utils');

// Test Sandbox
const SANDBOX_PATH = path.resolve(__dirname, '..', '.sandbox');
const MODEL_APP_PATH = 'src/models';
const CONTROLLER_PATH = 'src/controllers';
const REPOSITORY_APP_PATH = 'src/repositories';

const sandbox = new TestSandbox(SANDBOX_PATH);

const hasManyrImportRegEx = /import \{Entity, model, property, hasMany\} from '@loopback\/repository';\n/;
const sourceFileName = [
  'customer.model.ts',
  'customer-class.model.ts',
  'customer-class-type.model.ts',
];
const targetFileName = [
  'order.model.ts',
  'order-class.model.ts',
  'order-class-type.model.ts',
];
const controllerFileName = [
  'customer-order.controller.ts',
  'customer-class-order-class.controller.ts',
  'customer-class-type-order-class-type.controller.ts',
];
const repositoryFileName = [
  'customer.repository.ts',
  'customer-class.repository.ts',
  'customer-class-type.repository.ts',
];

describe('lb4 relation', function() {
  // tslint:disable-next-line:no-invalid-this
  this.timeout(30000);

  beforeEach('reset sandbox', async () => {
    await sandbox.reset();
  });

  // special cases regardless of the repository type
  context('generate model relation', () => {
    const promptArray = [
      {
        relationType: 'hasMany',
        sourceModel: 'Customer',
        destinationModel: 'Order',
      },
      {
        relationType: 'hasMany',
        sourceModel: 'CustomerClass',
        destinationModel: 'OrderClass',
      },
      {
        relationType: 'hasMany',
        sourceModel: 'CustomerClassType',
        destinationModel: 'OrderClassType',
      },
    ];

    const expectedImport = [
      /import \{Order\} from '\.\/order\.model';\n/,
      /import \{OrderClass\} from '\.\/order-class\.model';\n/,
      /import \{OrderClassType\} from '\.\/order-class-type\.model';\n/,
    ];
    const expectedDecoretor = [
      /\@hasMany\(\(\) => Order\)\n  orders: Order\[\];\n/,
      /\@hasMany\(\(\) => OrderClass ,\{keyTo: 'customerClassCustNumber'\}\)/,
      /\@hasMany\(\(\) => OrderClassType ,\{keyTo: 'customerClassTypeCustNumber'\}\)/,
    ];

    promptArray.forEach(function(multiItemPrompt, i) {
      it('add import hasMany, import for target model and hasMany decorator  ', async () => {
        await testUtils
          .executeGenerator(generator)
          .inDir(SANDBOX_PATH, () =>
            testUtils.givenLBProject(SANDBOX_PATH, {
              additionalFiles: SANDBOX_FILES,
            }),
          )
          .withPrompts(multiItemPrompt);

        const expectedSourceFile = path.join(
          SANDBOX_PATH,
          MODEL_APP_PATH,
          sourceFileName[i],
        );

        assert.file(expectedSourceFile);
        assert.fileContent(expectedSourceFile, hasManyrImportRegEx);
        assert.fileContent(expectedSourceFile, expectedImport[i]);

        assert.fileContent(expectedSourceFile, expectedDecoretor[i]);
      });
    });
  });

  context('generate model relation with custom relation name', () => {
    const promptArray = [
      {
        relationType: 'hasMany',
        sourceModel: 'Customer',
        destinationModel: 'Order',
        relationName: 'myOrders',
      },
      {
        relationType: 'hasMany',
        sourceModel: 'CustomerClass',
        destinationModel: 'OrderClass',
        relationName: 'myOrders',
      },
      {
        relationType: 'hasMany',
        sourceModel: 'CustomerClassType',
        destinationModel: 'OrderClassType',
        relationName: 'myOrders',
      },
    ];

    const expectedImport = [
      /import \{Order\} from '\.\/order\.model';\n/,
      /import \{OrderClass\} from '\.\/order-class\.model';\n/,
      /import \{OrderClassType\} from '\.\/order-class-type\.model';\n/,
    ];
    const expectedDecoretor = [
      /\@hasMany\(\(\) => Order\)\n  myOrders: Order\[\];\n/,
      /\@hasMany\(\(\) => OrderClass ,\{keyTo: 'customerClassCustNumber'\}\)/,
      /\@hasMany\(\(\) => OrderClassType ,\{keyTo: 'customerClassTypeCustNumber'\}\)/,
    ];
    const expectedProperty = [
      /@property\(\{\n    type: 'number',\n  \}\)\n  customerId\?\: number;\n/,
      /@property\(\{\n    type: 'number',\n  \}\)\n  customerClassCustNumber\?\: number;\n/,
      /@property\(\{\n    type: 'number',\n  \}\)\n  customerClassTypeCustNumber\?\: number;\n/,
    ];

    promptArray.forEach(function(multiItemPrompt, i) {
      it('relation name should be myOrders', async () => {
        await testUtils
          .executeGenerator(generator)
          .inDir(SANDBOX_PATH, () =>
            testUtils.givenLBProject(SANDBOX_PATH, {
              additionalFiles: SANDBOX_FILES,
            }),
          )
          .withPrompts(multiItemPrompt);

        const expectedSourceFile = path.join(
          SANDBOX_PATH,
          MODEL_APP_PATH,
          sourceFileName[i],
        );
        const expectedTargetFile = path.join(
          SANDBOX_PATH,
          MODEL_APP_PATH,
          targetFileName[i],
        );

        assert.file(expectedSourceFile);
        assert.fileContent(expectedSourceFile, hasManyrImportRegEx);

        assert.fileContent(expectedSourceFile, expectedImport[i]);

        assert.fileContent(expectedSourceFile, expectedDecoretor[i]);

        assert.fileContent(expectedTargetFile, expectedProperty[i]);
      });
    });
  });

  context('generate model relation with custom foreignKey', () => {
    const promptArray = [
      {
        relationType: 'hasMany',
        sourceModel: 'Customer',
        destinationModel: 'Order',
        foreignKeyName: 'mykey',
      },
      {
        relationType: 'hasMany',
        sourceModel: 'CustomerClass',
        destinationModel: 'OrderClass',
        foreignKeyName: 'mykey',
      },
      {
        relationType: 'hasMany',
        sourceModel: 'CustomerClassType',
        destinationModel: 'OrderClassType',
        foreignKeyName: 'mykey',
      },
    ];

    const expectedImport = [
      /import \{Order\} from '\.\/order\.model';\n/,
      /import \{OrderClass\} from '\.\/order-class\.model';\n/,
      /import \{OrderClassType\} from '\.\/order-class-type\.model';\n/,
    ];
    const expectedDecoretor = [
      /\@hasMany\(\(\) => Order ,\{keyTo: 'mykey'\}\)\n  orders: Order\[\];\n/,
      /\@hasMany\(\(\) => OrderClass ,\{keyTo: 'mykey'\}\)\n  orderClasses: OrderClass\[\];\n/,
      /\@hasMany\(\(\) => OrderClassType ,\{keyTo: 'mykey'\}\)\n  orderClassTypes: OrderClassType\[\];\n/,
    ];
    const expectedProperty = /@property\(\{\n    type: 'number',\n  \}\)\n  mykey\?\: number;\n/;

    promptArray.forEach(function(multiItemPrompt, i) {
      it('add the keyTo to the source model', async () => {
        await testUtils
          .executeGenerator(generator)
          .inDir(SANDBOX_PATH, () =>
            testUtils.givenLBProject(SANDBOX_PATH, {
              additionalFiles: SANDBOX_FILES,
            }),
          )
          .withPrompts(multiItemPrompt);

        const expectedSourceFile = path.join(
          SANDBOX_PATH,
          MODEL_APP_PATH,
          sourceFileName[i],
        );
        const expectedTargetFile = path.join(
          SANDBOX_PATH,
          MODEL_APP_PATH,
          targetFileName[i],
        );

        assert.file(expectedSourceFile);
        assert.fileContent(expectedSourceFile, hasManyrImportRegEx);

        assert.fileContent(expectedSourceFile, expectedImport[i]);

        assert.fileContent(expectedSourceFile, expectedDecoretor[i]);

        assert.fileContent(expectedTargetFile, expectedProperty);
      });
    });
  });

  context('generate model relation with default relation name', () => {
    const promptArray = [
      {
        relationType: 'hasMany',
        sourceModel: 'Customer',
        destinationModel: 'Order',
      },
      {
        relationType: 'hasMany',
        sourceModel: 'CustomerClass',
        destinationModel: 'OrderClass',
      },
      {
        relationType: 'hasMany',
        sourceModel: 'CustomerClassType',
        destinationModel: 'OrderClassType',
      },
    ];

    const expectedDecoretor = [
      /\@hasMany\(\(\) => Order\)\n  orders: Order\[\];\n/,
      /\@hasMany\(\(\) => OrderClass ,\{keyTo: 'customerClassCustNumber'\}\)\n/,
      /\@hasMany\(\(\) => OrderClassType ,\{keyTo: 'customerClassTypeCustNumber'\}\)\n/,
    ];
    const defaultRelationName = ['orders', 'orderClasses', 'orderClassTypes'];
    promptArray.forEach(function(multiItemPrompt, i) {
      it('relation name should be ' + defaultRelationName[i], async () => {
        await testUtils
          .executeGenerator(generator)
          .inDir(SANDBOX_PATH, () =>
            testUtils.givenLBProject(SANDBOX_PATH, {
              additionalFiles: SANDBOX_FILES,
            }),
          )
          .withPrompts(multiItemPrompt);

        const expectedSourceFile = path.join(
          SANDBOX_PATH,
          MODEL_APP_PATH,
          sourceFileName[i],
        );

        assert.fileContent(expectedSourceFile, expectedDecoretor[i]);
      });
    });
  });
});

context('check if the controller file created ', () => {
  const promptArray = [
    {
      relationType: 'hasMany',
      sourceModel: 'Customer',
      destinationModel: 'Order',
    },
    {
      relationType: 'hasMany',
      sourceModel: 'CustomerClass',
      destinationModel: 'OrderClass',
    },
    {
      relationType: 'hasMany',
      sourceModel: 'CustomerClassType',
      destinationModel: 'OrderClassType',
    },
  ];
  const controllerClass = [
    /class CustomerOrderController/,
    /class CustomerClassOrderClassController/,
    /class CustomerClassTypeOrderClassTypeController/,
  ];
  const controllerConstructor = [
    /constructor\(\n    \@repository\(CustomerRepository\) protected customerRepository: CustomerRepository,\n  \) \{ \}\n/,
    /constructor\(\n    \@repository\(CustomerClassRepository\) protected customerClassRepository: CustomerClassRepository,\n  \) \{ \}\n/,
    /constructor\(\n    \@repository\(CustomerClassTypeRepository\) protected customerClassTypeRepository: CustomerClassTypeRepository,\n  \) \{ \}\n/,
  ];

  const indexExport = [
    /export \* from '\.\/customer-order\.controller';/,
    /export \* from '\.\/customer-class-order-class\.controller';/,
    /export \* from '\.\/customer-class-type-order-class-type\.controller';/,
  ];
  const sourceClassnames = ['Customer', 'CustomerClass', 'CustomerClassType'];
  const targetClassnames = ['Order', 'OrderClass', 'OrderClassType'];

  promptArray.forEach(function(multiItemPrompt, i) {
    it('new controller file created', async () => {
      await testUtils
        .executeGenerator(generator)
        .inDir(SANDBOX_PATH, () =>
          testUtils.givenLBProject(SANDBOX_PATH, {
            additionalFiles: SANDBOX_FILES,
          }),
        )
        .withPrompts(multiItemPrompt);

      const expectedControllerFile = path.join(
        SANDBOX_PATH,
        CONTROLLER_PATH,
        controllerFileName[i],
      );
      assert.file(expectedControllerFile);
    }).timeout(10000);

    it('controller with hasMany class and constractor', async () => {
      const expectedControllerFile = path.join(
        SANDBOX_PATH,
        CONTROLLER_PATH,
        controllerFileName[i],
      );
      assert.fileContent(expectedControllerFile, controllerClass[i]);
      assert.fileContent(expectedControllerFile, controllerConstructor[i]);
    });

    it('the new controller file added to index.ts file', async () => {
      const expectedControllerIndexFile = path.join(
        SANDBOX_PATH,
        CONTROLLER_PATH,
        'index.ts',
      );

      assert.fileContent(expectedControllerIndexFile, indexExport[i]);
    });

    it(
      'controller GET Array of ' +
        targetClassnames[i] +
        "'s belonging to " +
        sourceClassnames[i],
      async () => {
        const getOrdersByCustomerIdRegEx = [
          /\@get\('\/customers\/{id}\/orders', {\n    responses: {\n      '200': {\n/,
          /description: 'Array of Order\\'s belonging to Customer',\n/,
          /content: {\n          'application\/json': {\n/,
          /schema: { type: 'array', items: { 'x-ts-type': Order } },/,
          /},\n .      },\n .    },\n .  },\n  }\)\n/,
          /async find\(\n .  \@param.path.number\('id'\) id: number,\n/,
          /\@param.query.object\('filter'\) filter\?: Filter,\n/,
          /\)\: Promise<Order\[]> {\n/,
          /return await this\.customerRepository\.orders\(id\)\.find\(filter\);\n  }\n/,
        ];
        const getOrdersClassByCustomerClassIdRegEx = [
          /\@get\('\/customer-classes\/{id}\/order-classes', {\n    responses: {\n      '200': {\n/,
          /description: 'Array of OrderClass\\'s belonging to CustomerClass',\n/,
          /content: {\n          'application\/json': {\n/,
          /schema: { type: 'array', items: { 'x-ts-type': OrderClass } },/,
          /},\n .      },\n .    },\n .  },\n  }\)\n/,
          /async find\(\n .  \@param.path.number\('id'\) id: number,\n/,
          /\@param.query.object\('filter'\) filter\?: Filter,\n/,
          /\)\: Promise<OrderClass\[]> {\n/,
          /return await this\.customerClassRepository\.orderClasses\(id\)\.find\(filter\);\n  }\n/,
        ];
        const getOrdersClassTypeByCustomerClassTypeIdRegEx = [
          /\@get\('\/customer-class-types\/{id}\/order-class-types', {\n    responses: {\n      '200': {\n/,
          /description: 'Array of OrderClassType\\'s belonging to CustomerClassType',\n/,
          /content: {\n          'application\/json': {\n/,
          /schema: { type: 'array', items: { 'x-ts-type': OrderClassType } },/,
          /},\n .      },\n .    },\n .  },\n  }\)\n/,
          /async find\(\n .  \@param.path.number\('id'\) id: number,\n/,
          /\@param.query.object\('filter'\) filter\?: Filter,\n/,
          /\)\: Promise<OrderClassType\[]> {\n/,
          /return await this\.customerClassTypeRepository\.orderClassTypes\(id\).find\(filter\);\n  }\n/,
        ];

        const getRegEx = [
          getOrdersByCustomerIdRegEx,
          getOrdersClassByCustomerClassIdRegEx,
          getOrdersClassTypeByCustomerClassTypeIdRegEx,
        ];

        const expectedControllerFile = path.join(
          SANDBOX_PATH,
          CONTROLLER_PATH,
          controllerFileName[i],
        );
        getRegEx[i].forEach(regex => {
          assert.fileContent(expectedControllerFile, regex);
        });
      },
    );

    it(
      'controller POST ' + targetClassnames[i] + ' to ' + sourceClassnames[i],
      async () => {
        const postClassCreateRegEx = [
          /\@post\('\/customers\/{id}\/orders', {\n    responses: {\n      '200': {\n/,
          /description: 'Customer model instance',\n/,
          /content: { 'application\/json': { schema: { 'x-ts-type': Order } } },\n/,
          /},\n .  },\n .}\)\n  async create\(\n/,
          /\@param\.path\.number\('id'\) id: typeof Customer\.prototype\.id,\n/,
          /\@requestBody\(\) order: Order,\n/,
          /\): Promise<Order> {\n/,
          /return await this\.customerRepository\.orders\(id\)\.create\(order\);\n  }\n/,
        ];
        const postMultiWordClassCreateRegEx = [
          /\@post\('\/customer-classes\/{id}\/order-classes', {\n    responses: {\n      '200': {\n/,
          /description: 'CustomerClass model instance',\n/,
          /content: { 'application\/json': { schema: { 'x-ts-type': OrderClass } } },\n/,
          /},\n .  },\n .}\)\n  async create\(\n/,
          /\@param\.path\.number\('id'\) id: typeof CustomerClass\.prototype\.custNumber,\n/,
          /\@requestBody\(\) orderClass: OrderClass,\n/,
          /\): Promise<OrderClass> {\n/,
          /return await this\.customerClassRepository\.orderClasses\(id\)\.create\(orderClass\);\n  }\n/,
        ];
        const postTypeClassCreateRegEx = [
          /\@post\('\/customer-class-types\/{id}\/order-class-types', {\n    responses: {\n      '200': {\n/,
          /description: 'CustomerClassType model instance',\n/,
          /content: { 'application\/json': { schema: { 'x-ts-type': OrderClassType } } },\n/,
          /},\n .  },\n .}\)\n  async create\(\n/,
          /\@param\.path\.number\('id'\) id: typeof CustomerClassType\.prototype\.custNumber,\n/,
          /\@requestBody\(\) orderClassType: OrderClassType,\n/,
          /\): Promise<OrderClassType> {\n/,
          /return await this\.customerClassTypeRepository\.orderClassTypes\(id\)\.create\(orderClassType\);\n  }\n/,
        ];

        const expectedControllerFile = path.join(
          SANDBOX_PATH,
          CONTROLLER_PATH,
          controllerFileName[i],
        );

        const postRegEx = [
          postClassCreateRegEx,
          postMultiWordClassCreateRegEx,
          postTypeClassCreateRegEx,
        ];

        postRegEx[i].forEach(regex => {
          assert.fileContent(expectedControllerFile, regex);
        });
      },
    );

    it(
      'controller ' +
        targetClassnames[i] +
        ' PATCH by ' +
        sourceClassnames[i] +
        ' id',
      async () => {
        const updateOrderByCustomerIdRegEx = [
          /\@patch\('\/customers\/{id}\/orders', {\n    responses: {\n      '200': {\n/,
          /description: 'Customer.Order PATCH success count',\n/,
          /content: { 'application\/json': { schema: CountSchema } },\n/,
          /},\n    },\n  }\)\n  async patch\(\n/,
          /\@param\.path\.number\('id'\) id: number,\n    \@requestBody\(\) order: Partial<Order>,\n/,
          /\@param\.query\.object\('where', getWhereSchemaFor\(Order\)\) where\?: Where,\n/,
          /\): Promise<Count> {\n/,
          /return await this\.customerRepository\.orders\(id\).patch\(order, where\);\n  }\n/,
        ];

        const updateOrderClassByCustomerClassIdRegEx = [
          /\@patch\('\/customer-classes\/{id}\/order-classes', {\n    responses: {\n      '200': {\n/,
          /description: 'CustomerClass.OrderClass PATCH success count',\n/,
          /content: { 'application\/json': { schema: CountSchema } },\n/,
          /},\n    },\n  }\)\n  async patch\(\n/,
          /\@param\.path\.number\('id'\) id: number,\n    \@requestBody\(\) orderClass: Partial<OrderClass>,\n/,
          /\@param\.query\.object\('where', getWhereSchemaFor\(OrderClass\)\) where\?: Where,\n/,
          /\): Promise<Count> {\n/,
          /return await this\.customerClassRepository\.orderClasses\(id\)\.patch\(orderClass, where\);\n  }\n/,
        ];

        const updateOrderClassByCustomerClassTypeIdRegEx = [
          /\@patch\('\/customer-class-types\/{id}\/order-class-types', {\n    responses: {\n      '200': {\n/,
          /description: 'CustomerClassType.OrderClassType PATCH success count',\n/,
          /content: { 'application\/json': { schema: CountSchema } },\n/,
          /},\n    },\n  }\)\n  async patch\(\n/,
          /\@param\.path\.number\('id'\) id: number,\n    \@requestBody\(\) orderClassType: Partial<OrderClassType>,\n/,
          /\@param\.query\.object\('where', getWhereSchemaFor\(OrderClassType\)\) where\?: Where,\n/,
          /\): Promise<Count> {\n/,
          /return await this\.customerClassTypeRepository\.orderClassTypes\(id\).patch\(orderClassType, where\);\n  }\n/,
        ];

        const expectedControllerFile = path.join(
          SANDBOX_PATH,
          CONTROLLER_PATH,
          controllerFileName[i],
        );

        const updateRegEx = [
          updateOrderByCustomerIdRegEx,
          updateOrderClassByCustomerClassIdRegEx,
          updateOrderClassByCustomerClassTypeIdRegEx,
        ];

        updateRegEx[i].forEach(regex => {
          assert.fileContent(expectedControllerFile, regex);
        });
      },
    );

    it(
      'controller ' +
        targetClassnames[i] +
        ' DELETE by ' +
        sourceClassnames[i] +
        ' id',
      async () => {
        const deleteOrderByCustomerIdRegEx = [
          /\@del\('\/customers\/{id}\/orders', {\n    responses: {\n      '200': {\n/,
          /description: 'Customer.Order DELETE success count',\n/,
          /content: { 'application\/json': { schema: CountSchema } },\n/,
          /},\n    },\n  }\)\n  async delete\(\n/,
          /\@param\.path\.number\('id'\) id: number,\n /,
          /\@param\.query\.object\('where', getWhereSchemaFor\(Order\)\) where\?: Where,\n/,
          /\): Promise<Count> {\n/,
          /return await this\.customerRepository\.orders\(id\)\.delete\(where\);\n  }\n}\n/,
        ];

        const deleteOrderClassByCustomerClassIdRegEx = [
          /\@del\('\/customer-classes\/{id}\/order-classes', {\n    responses: {\n      '200': {\n/,
          /description: 'CustomerClass.OrderClass DELETE success count',\n/,
          /content: { 'application\/json': { schema: CountSchema } },\n/,
          /},\n    },\n  }\)\n  async delete\(\n/,
          /\@param\.path\.number\('id'\) id: number,\n /,
          /\@param\.query\.object\('where', getWhereSchemaFor\(OrderClass\)\) where\?: Where,\n/,
          /\): Promise<Count> {\n/,
          /return await this\.customerClassRepository\.orderClasses\(id\)\.delete\(where\);\n  }\n}\n/,
        ];

        const deleteOrderClassTypeByCustomerClassTypeIdRegEx = [
          /\@del\('\/customer-class-types\/{id}\/order-class-types', {\n    responses: {\n      '200': {\n/,
          /description: 'CustomerClassType.OrderClassType DELETE success count',\n/,
          /content: { 'application\/json': { schema: CountSchema } },\n/,
          /},\n    },\n  }\)\n  async delete\(\n/,
          /\@param\.path\.number\('id'\) id: number,\n /,
          /\@param\.query\.object\('where', getWhereSchemaFor\(OrderClassType\)\) where\?: Where,\n/,
          /\): Promise<Count> {\n/,
          /return await this\.customerClassTypeRepository\.orderClassTypes\(id\)\.delete\(where\);\n  }\n}\n/,
        ];

        const expectedControllerFile = path.join(
          SANDBOX_PATH,
          CONTROLLER_PATH,
          controllerFileName[i],
        );

        const deleteRegEx = [
          deleteOrderByCustomerIdRegEx,
          deleteOrderClassByCustomerClassIdRegEx,
          deleteOrderClassTypeByCustomerClassTypeIdRegEx,
        ];

        deleteRegEx[i].forEach(regex => {
          assert.fileContent(expectedControllerFile, regex);
        });
      },
    );
  });
});

context('check source class repository ', () => {
  const promptArray = [
    {
      relationType: 'hasMany',
      sourceModel: 'Customer',
      destinationModel: 'Order',
    },
    {
      relationType: 'hasMany',
      sourceModel: 'CustomerClass',
      destinationModel: 'OrderClass',
    },
    {
      relationType: 'hasMany',
      sourceModel: 'CustomerClassType',
      destinationModel: 'OrderClassType',
    },
  ];

  const sourceClassnames = ['Customer', 'CustomerClass', 'CustomerClassType'];

  promptArray.forEach(function(multiItemPrompt, i) {
    it(sourceClassnames[i] + ' repostitory has all imports', async () => {
      await testUtils
        .executeGenerator(generator)
        .inDir(SANDBOX_PATH, () =>
          testUtils.givenLBProject(SANDBOX_PATH, {
            additionalFiles: SANDBOX_FILES,
          }),
        )
        .withPrompts(multiItemPrompt);

      const repositoryBasicImports = [
        /repository, HasManyRepositoryFactory} from '\@loopback\/repository';\n/,
        /import \{inject, Getter\} from '\@loopback\/core';/,
      ];

      const repositoryClassImport = [
        /import \{OrderRepository\} from '\.\/order\.repository';/,
        /import \{Customer, Order\} from '\.\.\/models';/,
      ];
      const repositoryMultiWordClassImport = [
        /import \{OrderClassRepository\} from '\.\/order-class\.repository';/,
        /import \{CustomerClass, OrderClass\} from '\.\.\/models';/,
      ];
      const repositoryTypeClassImport = [
        /import \{OrderClassTypeRepository\} from '\.\/order-class-type\.repository';/,
        /import \{CustomerClassType, OrderClassType\} from '\.\.\/models';/,
      ];

      const sourceRepositoryFile = path.join(
        SANDBOX_PATH,
        REPOSITORY_APP_PATH,
        repositoryFileName[i],
      );

      repositoryBasicImports.forEach(regex => {
        assert.fileContent(sourceRepositoryFile, regex);
      });

      const importRegEx = [
        repositoryClassImport,
        repositoryMultiWordClassImport,
        repositoryTypeClassImport,
      ];

      importRegEx[i].forEach(regex => {
        assert.fileContent(sourceRepositoryFile, regex);
      });
    }).timeout(10000);

    it('repository has updated constructor', async () => {
      const singleWordClassConstractor = [
        /public readonly orders: HasManyRepositoryFactory<Order, typeof Customer\.prototype\.id>;\n/,
        /constructor\(\@inject\('datasources\.db'\) dataSource: DbDataSource, \@repository\.getter\('OrderRepository'\) protected orderRepositoryGetter: Getter<OrderRepository>,\) \{\n/,
        /super\(Customer, dataSource\);\n    this.orders = this.createHasManyRepositoryFactoryFor\('orders', orderRepositoryGetter,\);\n  \}\n/,
      ];

      const multiWordClassConstractor = [
        /public readonly orderClasses: HasManyRepositoryFactory<OrderClass, typeof CustomerClass\.prototype\.custNumber>;\n/,
        /constructor\(\@inject\('datasources\.myDB'\) dataSource: MyDBDataSource, \@repository\.getter\('OrderClassRepository'\) protected orderClassRepositoryGetter: Getter<OrderClassRepository>,\) \{\n/,
        /super\(CustomerClass, dataSource\);\n    this\.orderClasses = this\.createHasManyRepositoryFactoryFor\('orderClasses', orderClassRepositoryGetter,\);\n  \}\n/,
      ];
      const typeClassConstractor = [
        /public readonly orderClassTypes: HasManyRepositoryFactory<OrderClassType, typeof CustomerClassType\.prototype\.custNumber>;\n/,
        /constructor\(@inject\('datasources\.myDB'\) dataSource: MyDBDataSource, @repository\.getter\('OrderClassTypeRepository'\) protected orderClassTypeRepositoryGetter: Getter<OrderClassTypeRepository>,\) \{\n/,
        /super\(CustomerClassType, dataSource\);\n    this\.orderClassTypes = this\.createHasManyRepositoryFactoryFor\('orderClassTypes', orderClassTypeRepositoryGetter,\);\n  \}/,
      ];

      const sourceRepositoryFile = path.join(
        SANDBOX_PATH,
        REPOSITORY_APP_PATH,
        repositoryFileName[i],
      );

      const updateConstructorRegEx = [
        singleWordClassConstractor,
        multiWordClassConstractor,
        typeClassConstractor,
      ];
      updateConstructorRegEx[i].forEach(regex => {
        assert.fileContent(sourceRepositoryFile, regex);
      });
    });
  });
});
