export const typeDefs = `#graphql
  type Employee {
    id: ID!
    name: String!
    email: String!
    age: Int!
    department: String!
    position: String!
    phone: String!
    salary: Float!
    joinDate: String!
    status: String!
    skills: [String!]!
    address: Address
    emergencyContact: EmergencyContact
    flagged: Boolean!
    notes: String
    createdAt: String!
    updatedAt: String!
  }

  type Address {
    street: String
    city: String
    state: String
    zipCode: String
    country: String
  }

  type EmergencyContact {
    name: String
    relationship: String
    phone: String
  }

  type User {
    id: ID!
    username: String!
    email: String!
    role: String!
    createdAt: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type PaginatedEmployees {
    employees: [Employee!]!
    totalCount: Int!
    pageInfo: PageInfo!
  }

  type PageInfo {
    currentPage: Int!
    totalPages: Int!
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
  }

  input EmployeeFilterInput {
    department: String
    status: String
    minSalary: Float
    maxSalary: Float
    search: String
  }

  input EmployeeSortInput {
    field: String!
    order: String!
  }

  input AddressInput {
    street: String
    city: String
    state: String
    zipCode: String
    country: String
  }

  input EmergencyContactInput {
    name: String
    relationship: String
    phone: String
  }

  input CreateEmployeeInput {
    name: String!
    email: String!
    age: Int!
    department: String!
    position: String!
    phone: String!
    salary: Float!
    joinDate: String
    status: String
    skills: [String!]
    address: AddressInput
    emergencyContact: EmergencyContactInput
    notes: String
  }

  input UpdateEmployeeInput {
    name: String
    email: String
    age: Int
    department: String
    position: String
    phone: String
    salary: Float
    joinDate: String
    status: String
    skills: [String!]
    address: AddressInput
    emergencyContact: EmergencyContactInput
    flagged: Boolean
    notes: String
  }

  type Query {
    employees(filter: EmployeeFilterInput, sort: EmployeeSortInput): [Employee!]!
    employee(id: ID!): Employee
    employeesPaginated(
      page: Int
      limit: Int
      filter: EmployeeFilterInput
      sort: EmployeeSortInput
    ): PaginatedEmployees!
    me: User
    stats: EmployeeStats!
  }

  type EmployeeStats {
    totalEmployees: Int!
    activeEmployees: Int!
    departmentCounts: [DepartmentCount!]!
    averageSalary: Float!
  }

  type DepartmentCount {
    department: String!
    count: Int!
  }

  type Mutation {
    register(username: String!, email: String!, password: String!, role: String): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    
    addEmployee(input: CreateEmployeeInput!): Employee!
    updateEmployee(id: ID!, input: UpdateEmployeeInput!): Employee!
    deleteEmployee(id: ID!): Boolean!
    toggleFlag(id: ID!): Employee!
  }
`;
