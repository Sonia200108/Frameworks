using System.Data;
using System.Data.Common;
using System.Data.SqlClient;

namespace Winkel
{
    class DataStorageMetDataTable: DataStorage
    {
        private DataTable table;

        private CustomerTableDAO adapter;

        public DataStorageMetDataTable()
        {
            adapter = new CustomerTableDAO(dbProviderFactory, GetConnection());

            table = adapter.GetCustomersWithoutUpdate();
        }

        public void DeleteCustomer(string customerNumber)
        {
            DataRow? rij = table.Rows.Find(customerNumber);
            if (rij != null)
            {
                rij.Delete();
            }

        }

        public void AddCustomer(Customer customer)
        {
            DataRow row = table.NewRow();

            row[ADDRESSLINE1] = customer.AddressLine1;
            row[ADDRESSLINE2] = customer.AddressLine2;
            row[CITY] = customer.City;
            row[CONTACTFIRSTNAME] = customer.ContactFirstName;
            row[CONTACTLASTNAME] = customer.ContactLastName;
            row[COUNTRY] = customer.Country;
            row[CREDITLIMIT] = customer.CreditLimit;
            row[CUSTOMERNAME] = customer.CustomerName;
            row[CUSTOMERNUMBER] = customer.CustomerNumber;
            row[PHONE] = customer.Phone;
            row[POSTALCODE] = customer.PostalCode;
            row[SALESREPEMPLOYEENUMBER] = customer.SalesRepEmployeeNumber;
            row[STATE] = customer.State;

            table.Rows.Add(row);
        }

        public void UpdateCustomer(string alleVelden, string alleWaarden, string customerNumber)
        {
            DataRow? row = table.Rows.Find(customerNumber);
            if (row != null)
            {
                string[] velden = alleVelden.Split(';');
                string[] waarden = alleWaarden.Split(';');
                for (int i = 0; i < velden.Length; i++)
                {
                    row[velden[i]] = waarden[i];
                }
            }
        }

        private List<Customer> GetCustomersFromTable(DataTable table)
        {
            List<Customer> list = new List<Customer>();
            foreach (DataRow row in table.Rows)
            {
                Customer customer = new Customer();
                customer.AddressLine1 = row[ADDRESSLINE1].ToString(); customer.AddressLine2 = row[ADDRESSLINE2].ToString();
                customer.City = row[CITY].ToString();
                customer.ContactFirstName = row[CONTACTFIRSTNAME].ToString();
                customer.ContactLastName = row[CONTACTLASTNAME].ToString();
                customer.Country = row[COUNTRY].ToString();
                customer.CreditLimit = (double)row[CREDITLIMIT];
                customer.CustomerName = row[CUSTOMERNAME].ToString();
                customer.CustomerNumber = (int)row[CUSTOMERNUMBER];
                customer.Phone = row[PHONE].ToString();
                customer.PostalCode = row[POSTALCODE].ToString();
                if (!(row[SALESREPEMPLOYEENUMBER] is System.DBNull))
                {
                    customer.SalesRepEmployeeNumber = (int)row[SALESREPEMPLOYEENUMBER];
                }
                // foutmelding: conversie niet geldig -> als DBNull niet getest werd!
                customer.State = row[STATE].ToString();

                list.Add(customer);

            }

            return list;

        }

        public List<Customer> GetCustomersFromDataBase_WithoutDataTableUpdate()
        {
            return GetCustomersFromTable(adapter.GetCustomersWithoutUpdate());
        }

        public List<Customer> GetCustomersFromDataTable_NotCertainTheyAreInDataBase()
        {
            return GetCustomersFromTable(table);
        }


        public void Update()
        {
            adapter.Update(table);
        }
        ~DataStorageMetDataTable()
        {
            Update();
        }

    }
}
