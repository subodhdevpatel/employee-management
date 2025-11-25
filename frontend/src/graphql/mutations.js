import { gql } from '@apollo/client';

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        username
        email
        role
      }
    }
  }
`;

export const REGISTER = gql`
  mutation Register($username: String!, $email: String!, $password: String!, $role: String) {
    register(username: $username, email: $email, password: $password, role: $role) {
      token
      user {
        id
        username
        email
        role
      }
    }
  }
`;

export const ADD_EMPLOYEE = gql`
  mutation AddEmployee($input: CreateEmployeeInput!) {
    addEmployee(input: $input) {
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

export const UPDATE_EMPLOYEE = gql`
  mutation UpdateEmployee($id: ID!, $input: UpdateEmployeeInput!) {
    updateEmployee(id: $id, input: $input) {
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
    }
  }
`;

export const DELETE_EMPLOYEE = gql`
  mutation DeleteEmployee($id: ID!) {
    deleteEmployee(id: $id)
  }
`;

export const TOGGLE_FLAG = gql`
  mutation ToggleFlag($id: ID!) {
    toggleFlag(id: $id) {
      id
      flagged
    }
  }
`;
