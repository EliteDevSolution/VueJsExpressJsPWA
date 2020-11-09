<script>
    export default {
        methods: {
            $can(permission) {
                if (Array.isArray(permission) && permission.length > 0)
                {
                    return this.$store.state.AppActiveUser.roles.some( ele => permission.includes(ele) );
                }
                return true;
            },
        },
    };
</script>
