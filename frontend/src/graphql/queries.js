import { gql } from '@apollo/client';

export const GET_EMPLOYEES = gql`
  query GetEmployees($filter: EmployeeFilterInput, $sort: EmployeeSortInput) {
    employees(filter: $filter, sort: $sort) {
      id
      name
      email
      age
      department
      position
      phone
      salary
      joinDate
      status
      skills
      flagged
    }
  }
`;

export const GET_EMPLOYEES_PAGINATED = gql`
  query GetEmployeesPaginated($page: Int, $limit: Int, $filter: EmployeeFilterInput, $sort: EmployeeSortInput) {
    employeesPaginated(page: $page, limit: $limit, filter: $filter, sort: $sort) {
      employees {
        id
        name
        email
        age
        department
        position
        phone
        salary
        joinDate
        status
        skills
        flagged
      }
      totalCount
      pageInfo {
        currentPage
        totalPages
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

export const GET_EMPLOYEE = gql`
  query GetEmployee($id: ID!) {
    employee(id: $id) {
      id
      name
      email
      age
      department
      position
      phone
      salary
      joinDate
      status
      skills
      address {
        street
        city
        state
        zipCode
        country
      }
      emergencyContact {
        name
        relationship
        phone
      }
      flagged
      notes
      createdAt
      updatedAt
    }
  }
`;

export const GET_ME = gql`
  query GetMe {
    me {
      id
      username
      email
      role
    }
  }
`;

export const GET_STATS = gql`
  query GetStats {
    stats {
      totalEmployees
      activeEmployees
      departmentCounts {
        department
        count
      }
      averageSalary
    }
  }
`;
