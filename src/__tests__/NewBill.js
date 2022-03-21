/**
 * @jest-environment jsdom
 */

 import {screen, waitFor, fireEvent} from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { ROUTES, ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store"
import userEvent from '@testing-library/user-event'
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import router from "../app/Router.js";
jest.mock("../app/store", () => mockStore)

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    beforeEach(() => {
          Object.defineProperty(window, 'localStorage', { value: localStorageMock })
            window.localStorage.setItem('user', JSON.stringify({
              type: 'Employee'
            }))
            document.body.innerHTML = NewBillUI()
    })
    test('then it should render the form of the NewBillUI', () => {
      const form = screen.getByTestId('form-new-bill')
      expect(form).toBeTruthy()
    })
    describe('when I want to upload an image file', () => {
        test('then there should be a image file in the appropriate element', () => {
          // doc https://testing-library.com/docs/ecosystem-user-event/
          const onNavigate = (pathname) => {
            document.body.innerHTML = ROUTES({ pathname })
          }
          const file = new File(['hello'], 'hello.png', {type: 'image/png'}) 
            const store = mockStore
            const createdBill = new NewBill({
            document,
            onNavigate,
            store,
            localStorage: window.localStorage
            });
            const handleChangeFile = jest.fn((e) => createdBill.handleChangeFile(e));
            const inputFile = screen.getByTestId('file');
            inputFile.addEventListener('change', handleChangeFile);
            userEvent.upload(inputFile, file)
            expect(inputFile.files[0]).toStrictEqual(file)
            expect(inputFile.files.item(0)).toStrictEqual(file)
            expect(inputFile.files).toHaveLength(1)
          })
     
      })
      describe('when I want to upload not an image file', () => {
        test('then there should be a alert displayed', () => {
          jest.spyOn(window, 'alert').mockImplementation(() => {});
          const onNavigate = (pathname) => {
            document.body.innerHTML = ROUTES({ pathname })
          }
          const file = new File(['hello'], 'hello.gif', {type: 'image/gif'}) 
            const store = mockStore
            const createdBill = new NewBill({
            document,
            onNavigate,
            store,
            localStorage: window.localStorage
            });
            const handleChangeFile = jest.fn((e) => createdBill.handleChangeFile(e));
            const inputFile = screen.getByTestId('file');
            inputFile.addEventListener('change', handleChangeFile);
            userEvent.upload(inputFile, file)
            expect(handleChangeFile).toHaveBeenCalled()
            expect(window.alert).toHaveBeenCalledWith("veuillez saisir un fichier avec une extension jpg, jpeg, png ou gif")
          })
     
      })
      describe('when I want to submit the form', () => {
        test('then it should stay on newBillPage if data are not good', () => {
          const onNavigate = (pathname) => {
            document.body.innerHTML = ROUTES({ pathname, data: bills });
        };
          const store = mockStore
          const createdBill = new NewBill({
            document,
            onNavigate,
            store,
            localStorage: window.localStorage
          });
          const handleSubmit = jest.spyOn(createdBill, 'handleSubmit')
          const form = screen.getByTestId("form-new-bill");
          form.addEventListener('submit', handleSubmit);
          userEvent.click(form);
          expect(handleSubmit).not.toHaveBeenCalled()
          expect(screen.getByTestId("form-new-bill")).toBeTruthy();
        })
        test('then it should call the submit function if the data are goods and posted', async () => {
          const onNavigate = (pathname) => {
            document.body.innerHTML = ROUTES({ pathname, data: bills });
        };
          const file = new File(['hello'], 'hello.png', {type: 'image/png'}) 
          const store = mockStore
          const createdBill = new NewBill({
            document,
            onNavigate,
            store,
            localStorage: window.localStorage
          });
          console.log(store)
          const handleSubmit = jest.spyOn(createdBill, 'handleSubmit')
          const form = screen.getByTestId("form-new-bill")
          const handleChangeFile = jest.fn((e) => createdBill.handleChangeFile(e));
          const inputFile = screen.getByTestId('file');
          inputFile.addEventListener('change', handleChangeFile);
          userEvent.upload(inputFile, file)
          screen.getByTestId("expense-type").value = "Transports"
          screen.getByTestId("expense-name").value = "Vol paris nice"
          screen.getByTestId("datepicker").value = "2021-05-25"
          screen.getByTestId("amount").value = "300"
          screen.getByTestId("vat").value = "20"
          screen.getByTestId("pct").value = "20"
          screen.getByTestId("commentary").value = "class eco"
          form.addEventListener('submit', handleSubmit);
          fireEvent.submit(form)     
          expect(handleSubmit).toHaveBeenCalled()
          await waitFor(() => screen.getByText("Mes notes de frais"))
          const billsPage = screen.getByText("Mes notes de frais");
          expect(billsPage).toBeTruthy();
        })
      })
    })
  })



// test d'intégration POST
describe("Given I am a user connected as Employee", () => {
  describe("When I do fill required fileds in good format and I click on submit button", () => {
      test("Then Add new bill to mock API POST", async () => {
        const html = NewBillUI()
        document.body.innerHTML = html  
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname, data: bills })
        }
        const createdBill = new NewBill({
          document,
          onNavigate,
          store: mockStore,
          localStorage: window.localStorage,
      });
      expect(createdBill).toBeDefined()
      expect(screen.getByText('Envoyer une note de frais')).toBeTruthy()
      const billToTest = {
             id: "BeKy598729423xZ",
             vat: "10",
             amount: 50,
             name: "test de la méthode post",
             fileName: "toto.jpeg",
             commentary: "test post newbill",
             pct: 20,
             type: "Transports",
             email: "a@a",
             fileUrl:
                 "https://toto.jpg",
             date: "2022-02-14",
             status: "pending",
             commentAdmin: "euh",
            };
            const handleSubmit = jest.spyOn(createdBill, 'handleSubmit')
            const form = screen.getByTestId("form-new-bill")
            form.addEventListener('submit', handleSubmit);
            fireEvent.submit(form)     
            expect(handleSubmit).toHaveBeenCalled()

            const getSpy = jest.spyOn(mockStore, "bills");

            const billTested = await mockStore.bills().update(billToTest);

            expect(getSpy).toHaveBeenCalledTimes(1); 
            expect(billTested.id).toBe("47qAXb6fIm2zOKkLzMro")
      });
    });
    describe("When an error occurs on API", () => {
      beforeEach(() => {
        jest.spyOn(mockStore, "bills")
        Object.defineProperty(
            window,
            'localStorage',
            { value: localStorageMock }
        )
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee',
          email: "a@a"
        }))
        const root = document.createElement("div")
        root.setAttribute("id", "root")
        document.body.appendChild(root)
        router()
      }) 
      test("fetches bills from an API and fails with 404 message error", async () => {
        mockStore.bills.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 500"))
      )
      const html = BillsUI({ error: "Erreur 500" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 500/)
      expect(message).toBeTruthy()
      })
  
      test("fetches messages from an API and fails with 500 message error", async () => {
        mockStore.bills.mockImplementationOnce(() =>
            Promise.reject(new Error("Erreur 500"))
          )
          const html = BillsUI({ error: "Erreur 500" })
          document.body.innerHTML = html
          const message = await screen.getByText(/Erreur 500/)
          expect(message).toBeTruthy()
      })
    })
  })
