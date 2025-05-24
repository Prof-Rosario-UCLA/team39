<script>
	let { children } = $props();
</script>
<!-- 
<head>
    <title>CountryGUESSR</title>
    <meta charset="UTF-8">
    <meta name="author" content="Gregory Payton">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head> -->

<nav>
    <div>
        <h1>CountryGUESSR</h1>
    </div>
</nav>

 {@render children()}

 <style>
    h1 {
        font-variant: small-caps;
        color: darkgreen;
    }
 </style>
