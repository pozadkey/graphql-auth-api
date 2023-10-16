import { objectType } from 'nexus'

export const UserType = objectType({
  name: 'User',         
  definition(t) {
    t.int('id')          
    t.string('username')     
    t.string('email')       
    t.string('password') 
  },
});