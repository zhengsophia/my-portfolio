<svelte:head>
  <title>Sophia's Contact</title>
</svelte:head>
<h1>My Contact Info</h1>
<form action="mailto:sjzheng@mit.edu" method="POST" enctype="text/plain">
  <label>Email:</label>
  <input name="email" type="email" />

  <label>Subject:</label>
  <input name="subject" />

  <label>Body:</label>
  <textarea name="body"></textarea>

  <button>Submit</button>
</form>
