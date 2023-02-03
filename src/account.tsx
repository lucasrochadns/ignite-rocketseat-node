export type Account = 
{
   name: string,
   cpf: string,
   saldo: number,
   adress:
   {
      city: string,
      street: string,
      state: string,
      country: String,
   }
};