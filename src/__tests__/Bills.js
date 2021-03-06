/**
 * @jest-environment jsdom
 */

 import {screen, waitFor} from "@testing-library/dom"
 import BillsUI from "../views/BillsUI.js"
 import { bills } from "../fixtures/bills.js"
 import { ROUTES, ROUTES_PATH} from "../constants/routes.js";
 import {localStorageMock} from "../__mocks__/localStorage.js";
 import Bills from '../containers/Bills.js'
 import mockStore from "../__mocks__/store"
 import router from "../app/Router.js";
 import userEvent from '@testing-library/user-event'
 
 jest.mock("../app/store", () => mockStore)
 describe("Given I am connected as an employee", () => {
   describe("When I am on Bills Page", () => {
     test("Then bill icon in vertical layout should be highlighted", async () => {
       Object.defineProperty(window, 'localStorage', { value: localStorageMock })
       window.localStorage.setItem('user', JSON.stringify({
         type: 'Employee'
       }))
       const root = document.createElement("div")
       root.setAttribute("id", "root")
       document.body.append(root)
       router()
       window.onNavigate(ROUTES_PATH.Bills)
       await waitFor(() => screen.getByTestId('icon-window'))
       const windowIcon = screen.getByTestId('icon-window')
       //to-do write expect expression
       windowIcon.classList.add('active-icon')
       expect(windowIcon.classList.contains("active-icon")).toBeTruthy()
     })
     test("then the loader must appear before the tickets are displayed", () => {
       const html = BillsUI({ loading: true });
       document.body.innerHTML = html;
       expect(screen.getAllByText("Loading...")).toBeTruthy();
   });
     test("Then bills should be ordered from earliest to latest", () => {
       document.body.innerHTML = BillsUI({ data: bills })
       const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
       const antiChrono = (a, b) => ((a < b) ? 1 : -1)
       const datesSorted = [...dates].sort(antiChrono)
       expect(dates).toEqual(datesSorted)
     })
     test("then the error message must appear if the tickets can't be displayed", () => {
       const html = BillsUI({ data: [], loading : false, error : true})
       document.body.innerHTML = html
       expect(screen.getByTestId('error-message')).toBeTruthy()
   })
   })
   describe("When click on icon Eye", () => {
     test("expect on icon Eye Click to have a vue on the bill", () => {
     Object.defineProperty(window, 'localStorage', { value: localStorageMock })
     window.localStorage.setItem('user', JSON.stringify({
       type: 'Employee'
     }))
     document.body.innerHTML = BillsUI({ data: bills })
 
     const onNavigate = (pathname) => {
         document.body.innerHTML = ROUTES({ pathname })
       }
     $.fn.modal = jest.fn(() => $())
     const store = null
     const createdBill = new Bills({
         document,
         onNavigate,
         store,
         localStorage: window.localStorage
     });
     const eyeToClick = screen.getAllByTestId('icon-eye')
     const eyeToClick1 = eyeToClick[0]
     console.log(eyeToClick1)
     const handleClickIconEye = jest.fn(createdBill.handleClickIconEye(eyeToClick1));
     eyeToClick1.addEventListener("click", handleClickIconEye);
     userEvent.click(eyeToClick1);
     expect(handleClickIconEye).toHaveBeenCalled();
     expect($.fn.modal).toHaveBeenCalled();
       })
     })
 
   describe('When I click on add bill', () => {
     test('Then I should be able to add a bill', () => {
       Object.defineProperty(window, 'localStorage', { value: localStorageMock })
     window.localStorage.setItem('user', JSON.stringify({
       type: 'Employee'
     }))
     document.body.innerHTML = BillsUI({ data: bills })
 
     const onNavigate = (pathname) => {
         document.body.innerHTML = ROUTES({ pathname })
       }
     const store = null
     const createdBill = new Bills({
         document,
         onNavigate,
         store,
         localStorage: window.localStorage
     });
       const addBill = screen.getByTestId('btn-new-bill');
       const handleClickIconAdd = jest.fn(createdBill.handleClickNewBill);
       addBill.addEventListener("click", handleClickIconAdd);
       userEvent.click(addBill);
       expect(handleClickIconAdd).toHaveBeenCalled();
       expect(screen.getByTestId("form-new-bill")).toBeTruthy();
       })
     })
     })
 
 
 
 
 // test d'int??gration GET
 describe("Given I am a user connected as Employee", () => {
   describe("When I navigate to Bills", () => {
     test("fetches bills from mock API GET", async () => {
       Object.defineProperty(window, 'localStorage', { value: localStorageMock })
       window.localStorage.setItem('user', JSON.stringify({
         type: 'Employee'
         , email: "a@a" ,
       }))
       const root = document.createElement("div")
       root.setAttribute("id", "root")
       document.body.append(root)
       router()
       window.onNavigate(ROUTES_PATH.Bills)
       await waitFor(() => screen.getByText("Mes notes de frais"))
       const contentPending  =  screen.getAllByTestId('testrows')
       expect(contentPending).toBeTruthy()
     })
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
 
       mockStore.bills.mockImplementationOnce(() => {
         return {
           list : () =>  {
             return Promise.reject(new Error("Erreur 404"))
           }
         }})
       window.onNavigate(ROUTES_PATH.Bills)
       await new Promise(process.nextTick);
       const message = await screen.getByText(/Erreur 404/)
       expect(message).toBeTruthy()
     })
 
     test("fetches messages from an API and fails with 500 message error", async () => {
 
       mockStore.bills.mockImplementationOnce(() => {
         return {
           list : () =>  {
             return Promise.reject(new Error("Erreur 500"))
           }
         }})
 
       window.onNavigate(ROUTES_PATH.Bills)
       await new Promise(process.nextTick);
       const message = await screen.getByText(/Erreur 500/)
       expect(message).toBeTruthy()
     })
   })
   })
   })
 