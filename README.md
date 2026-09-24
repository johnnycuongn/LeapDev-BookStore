## LEAP Dev NextJS Take Home Test

This is a very basic Book Store with static data and simple CRUD support.

Push this up to a public Github repository please. We will assess both code and commits in order to discern how you approach problem-solving.

---

Please implement the following:

1. Use a component library to make the UI and UX more appealing and user friendly.

As since this is a Book Store, where you should feel free to manage your bookshelf, the user experience should be seamless, easy to navigate, also fun to use. Therefore, firstly, alongside with Tailwind, I also implement HeroUI for simple user interface. There are some libraries I consider: Hero UI, shadcn/ui, MUI, Ant Design, . As for an experience to manage a book store, I'm considering something that is easy to navigate, minimal and clean. Therefore, I choose Hero UI.

2. Implement dark mode that includes a switcher to go back to light mode.

I have use Hero UI theme switcher to update.

3. Deleting a book displays a JavaScript alert. Replace this with modern UX.

4. Add a rating system that goes up to 5 stars.

5. There is a bug in the code. Find it and fix it.

Bug 1 - Adding book: When adding book, it is correct to use the max ID of current book, the plus 1. However, there will be case that a book shelf is empty, where there is no books inside, which id will it grap. Therfore, I add a fallback with 0 in Max function.

Bug 2 - Updating book: when updating book, the updated object should be at the last object, placing after the original object.

Correct code:
```javascript
book.id === selectedBook?.id ? { ...book , ...updatedBook} : book
```

Good luck and have fun!
