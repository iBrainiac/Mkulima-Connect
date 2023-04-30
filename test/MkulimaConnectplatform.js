const MkulimaConnect = artifacts.require("MkulimaConnect");

contract("MkulimaConnect", (accounts) => {
  let mkulimaConnect;
  const farmer = accounts[1];
  const consumer = accounts[2];

  beforeEach(async () => {
    mkulimaConnect = await MkulimaConnect.new({ from: accounts[0] });
    await mkulimaConnect.registerFarmer("Alice", "Nairobi", { from: farmer });
  });

  it("should register a farmer correctly", async () => {
    const registeredFarmer = await mkulimaConnect.farmers(farmer);
    assert.equal(registeredFarmer.name, "Alice");
    assert.equal(registeredFarmer.location, "Nairobi");
  });

  it("should list a product correctly", async () => {
    await mkulimaConnect.listProduct("Potatoes", "Fresh potatoes", 100, 50, { from: farmer });
    const product = await mkulimaConnect.products(1);
    assert.equal(product.name, "Potatoes");
    assert.equal(product.price, 100);
    assert.equal(product.quantity, 50);
  });

  it("should purchase a product correctly", async () => {
    await mkulimaConnect.listProduct("Potatoes", "Fresh potatoes", 100, 50, { from: farmer });
    await mkulimaConnect.purchaseProduct(1, 10, { from: consumer, value: 1000 });
    const product = await mkulimaConnect.products(1);
    assert.equal(product.quantity, 40);
  });
});
