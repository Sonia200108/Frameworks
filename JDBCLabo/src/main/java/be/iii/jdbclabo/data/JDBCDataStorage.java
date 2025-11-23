package be.iii.jdbclabo.data;

import be.iii.jdbclabo.model.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@Component
public class JDBCDataStorage implements IDataStorage {

    private final DataSource dataSource;
    private final JdbcClient jdbcClient;

    public JDBCDataStorage(DataSource dataSource, JdbcClient jdbcClient) {
        this.dataSource = dataSource;
        this.jdbcClient = jdbcClient;
    }

    // SQL injected from application.properties
    @Value("${sql.products.all}")
    private String sqlGetAllProducts;

    @Value("${sql.customers.all}")
    private String sqlGetAllCustomers;

    @Value("${sql.customers.insert}")
    private String sqlInsertCustomer;

    @Value("${sql.customers.update}")
    private String sqlUpdateCustomer;

    @Value("${sql.customers.delete}")
    private String sqlDeleteCustomer;

    @Value("${sql.customers.maxNumber}")
    private String sqlMaxCustomerNumber;

    @Value("${sql.orders.byCustomer}")
    private String sqlOrdersByCustomer;

    @Value("${sql.orders.maxNumber}")
    private String sqlMaxOrderNumber;

    @Value("${sql.order.insert}")
    private String sqlInsertOrder;

    @Value("${sql.orderdetails.insert}")
    private String sqlInsertOrderDetail;

    @Value("${sql.customer.total}")
    private String sqlGetTotal;

    @Override
    public List<IProduct> getProducts() throws DataExceptie {
        try{
            return jdbcClient
                    .sql(sqlGetAllProducts)
                    .query((rs,rownum)-> new Product(
                            rs.getString("productcode"),
                            rs.getString("productname"),
                            rs.getString("productline"),
                            rs.getString("productscale"),
                            rs.getString("productvendor"),
                            rs.getString("productdescription"),
                            rs.getInt("quantityinstock"),
                            rs.getDouble("buyprice"),
                            rs.getDouble("msrp")
                    ))
                    .list()
                    .stream()
                    .map(p-> (IProduct) p)
                    .toList();
        }catch (Exception e){
            throw new DataExceptie("Fout bij het ophalen van producten");
        }
    }

    @Override
    public List<ICustomer> getCustomers() throws DataExceptie {

        try(Connection connection = dataSource.getConnection();
            PreparedStatement statement = connection.prepareStatement(sqlGetAllCustomers);
            ResultSet rs = statement.executeQuery()){

            List<ICustomer> customers = new ArrayList<>();

            while(rs.next()){
                customers.add(new Customer(
                        rs.getInt("customernumber"),
                        rs.getString("customername"),
                        rs.getString("contactlastname"),
                        rs.getString("contactfirstname"),
                        rs.getString("phone"),
                        rs.getString("addressline1"),
                        rs.getString("addressline2"),
                        rs.getString("city"),
                        rs.getString("state"),
                        rs.getString("postalcode"),
                        rs.getString("country"),
                        rs.getInt("salesrepemployeenumber"),
                        rs.getDouble("creditlimit")
                ));
            }

            return customers;

        }catch(Exception e){
            throw new DataExceptie("Fout bij het ophalen van de klanten");
        }
    }

    @Override
    public List<IOrderWithoutDetails> getOrders(int customerNumber) throws DataExceptie {
        try {
            return jdbcClient
                    .sql(sqlOrdersByCustomer)
                    .param(customerNumber)
                    .query((rs, rowNum) -> new OrderWithoutDetails(
                            rs.getInt("ordernumber"),
                            rs.getDate("orderdate") != null ? new java.util.Date(rs.getDate("orderdate").getTime()) : null,
                            rs.getDate("requireddate") != null ? new java.util.Date(rs.getDate("requireddate").getTime()) : null,
                            rs.getDate("shippeddate") != null ? new java.util.Date(rs.getDate("shippeddate").getTime()) : null,
                            rs.getString("status"),
                            rs.getString("comments"),
                            rs.getInt("customernumber")
                    ))
                    .list()
                    .stream()
                    .map(o -> (IOrderWithoutDetails) o)
                    .toList();

        } catch (Exception ex) {
            throw new DataExceptie("Fout bij het ophalen van orders voor klant " + customerNumber);
        }
    }

    @Override
    public int maxCustomerNumber() throws DataExceptie {
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sqlMaxCustomerNumber);
             ResultSet rs = stmt.executeQuery()) {

            if (rs.next()) {
                return rs.getInt(1);  // eerste kolom: MAX(customerNumber)
            } else {
                return 0;  // tabel leeg? dan 0.
            }

        } catch (Exception ex) {
            throw new DataExceptie("Fout bij het bepalen van het grootste klantnummer");
        }
    }

    @Override
    public int maxOrderNumber() throws DataExceptie {
        try {
            Integer result = jdbcClient
                    .sql(sqlMaxOrderNumber)
                    .query(Integer.class)
                    .single();  // verwacht 1 waarde (MAX)

            return (result != null) ? result : 0;

        } catch (Exception ex) {
            throw new DataExceptie("Fout bij het bepalen van het grootste ordernummer");
        }
    }


    @Override
    public void addOrder(IOrder order) throws DataExceptie {
        Connection conn = null;

        try {
            conn = dataSource.getConnection();
            conn.setAutoCommit(false);  // begin transactie

            // --- INSERT ORDER ---
            try (PreparedStatement stmtOrder = conn.prepareStatement(sqlInsertOrder)) {

                stmtOrder.setInt(1, order.getOrderNumber());
                stmtOrder.setDate(2, order.getOrderDate() != null ?
                        new java.sql.Date(order.getOrderDate().getTime()) : null);

                stmtOrder.setDate(3, order.getRequiredDate() != null ?
                        new java.sql.Date(order.getRequiredDate().getTime()) : null);

                stmtOrder.setDate(4, order.getShippedDate() != null ?
                        new java.sql.Date(order.getShippedDate().getTime()) : null);

                stmtOrder.setString(5, order.getStatus());
                stmtOrder.setString(6, order.getComments());
                stmtOrder.setInt(7, order.getCustomerNumber());

                stmtOrder.executeUpdate();
            }

            // --- INSERT ORDER DETAILS ---
            try (PreparedStatement stmtDetail = conn.prepareStatement(sqlInsertOrderDetail)) {
                for (IOrderDetail detail : order.getDetails()) {

                    stmtDetail.setInt(1, order.getOrderNumber());
                    stmtDetail.setString(2, detail.getProductCode());
                    stmtDetail.setInt(3, detail.getQuantity());
                    stmtDetail.setDouble(4, detail.getPrice());
                    stmtDetail.setInt(5, detail.getOrderLineNumber());

                    stmtDetail.executeUpdate();
                }
            }

            conn.commit();  // alles ok → commit

        } catch (Exception ex) {
            // rollback bij eender welke fout
            if (conn != null) {
                try { conn.rollback(); } catch (Exception ignored) {}
            }
            throw new DataExceptie("Fout bij toevoegen van order met details");

        } finally {
            if (conn != null) {
                try { conn.setAutoCommit(true); conn.close(); } catch (Exception ignored) {}
            }
        }
    }


    @Override
    public void addCustomer(ICustomer customer) throws DataExceptie {
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sqlInsertCustomer)) {

            stmt.setInt(1, customer.getCustomerNumber());
            stmt.setString(2, customer.getCustomerName());
            stmt.setString(3, customer.getContactLastName());
            stmt.setString(4, customer.getContactFirstName());

            stmt.executeUpdate();

        } catch (Exception ex) {
            throw new DataExceptie("Fout bij het toevoegen van een klant");
        }
    }


    @Override
    public void modifyCustomer(ICustomer customer) throws DataExceptie {
        try {
            jdbcClient
                    .sql(sqlUpdateCustomer)
                    .param(customer.getCustomerName())
                    .param(customer.getContactLastName())
                    .param(customer.getContactFirstName())
                    .param(customer.getCustomerNumber())
                    .update();

        } catch (Exception ex) {
            throw new DataExceptie("Fout bij het aanpassen van klant " + customer.getCustomerNumber());
        }
    }


    @Override
    public void deleteCustomer(int customerNumber) throws DataExceptie {
        try {
            jdbcClient
                    .sql(sqlDeleteCustomer)
                    .param(customerNumber)
                    .update();

        } catch (Exception ex) {
            throw new DataExceptie("Fout bij verwijderen van klant " + customerNumber);
        }
    }


    @Override
    public double getTotal(int customerNumber) throws DataExceptie {
        try (Connection conn = dataSource.getConnection();
             CallableStatement stmt = conn.prepareCall(sqlGetTotal)) {

            // input parameter
            stmt.setInt(1, customerNumber);

            // output parameter
            stmt.registerOutParameter(2, Types.DOUBLE);

            stmt.execute();

            return stmt.getDouble(2);

        } catch (Exception ex) {
            throw new DataExceptie("Fout bij het berekenen van het totaalbedrag voor klant " + customerNumber);
        }
    }
}
