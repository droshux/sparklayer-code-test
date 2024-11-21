package main

import "net/http"
import "sync"
import "encoding/json"

type Todo struct {
	Title       string `json:"title"`
	Description string `json:"description"`
}

var todos []Todo
var mutex sync.RWMutex

func main() {
	todos = make([]Todo, 0)
	http.HandleFunc("/", ToDoListHandler)
	http.ListenAndServe(":8080", http.DefaultServeMux)
}

func ToDoListHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	switch r.Method {
	case http.MethodGet:
		mutex.RLock()
		defer mutex.RUnlock()

		w.Header().Set("content-type", "appication/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(todos)
		return
	case http.MethodPost:
		mutex.Lock()
		defer mutex.Unlock()

		var todo Todo
		err := json.NewDecoder(r.Body).Decode(&todo)
		if err != nil {
			http.Error(w, "Invalid input", http.StatusBadRequest)
			return
		}

		if len(todos) == 0 {
		}
		todos = append(todos, todo)

		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(todo)
		return
	default:
		return
	}
}
